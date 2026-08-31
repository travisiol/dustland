"""
Builds the 999-parcel lunar grid that the whole site is drawn from.

Run:  python scripts/build-parcels.py

Writes two generated files into src/data/. Those outputs are committed, so
the app never fetches or computes geodata at build or run time — this script
only needs to run again if the parcel count or grid size changes.

Why a hex grid in an equal-area projection: every parcel has to be the same
amount of ground for "one parcel" to mean anything. Equal Earth is
equal-area, so a regular hex lattice laid on the projected plane gives 999
cells of genuinely identical area on the sphere. A lat/lon grid would not —
its cells shrink toward the poles, and a parcel at Peary would quietly be
worth a fraction of one at Tranquillitatis. The projection is named for the
wrong world; the maths only cares that the body is a sphere, and the Moon is
a rounder one than Earth.

What differs from a terrestrial build: there is no ocean, so there is no
land mask. Every hex whose centre falls on the sphere counts, and the grid
covers the entire body. The only cells trimmed are the slivers at the map's
±180° limb, which is a boundary of the projection rather than a feature of
the Moon.

Feature names come from the IAU/USGS Gazetteer of Planetary Nomenclature
(public domain), transcribed into the catalogue below rather than fetched,
so the build stays offline. Extents are the catalogued diameters, modelled
as circles except where MINOR_AXIS_KM gives a second axis. That is an
approximation and it is worth stating what it costs: it puts 236 parcels on
mare, about 23% of the surface, where the published figure for the maria is
nearer 16%. The overshoot is the circles, which circumscribe irregular
plains rather than matching them. Every named region is in the right place
and at roughly the right size; the basalt edges are generous by a parcel or
two. Fixing that properly means the USGS Unified Geologic Map of the Moon,
which is a download and a shapefile dependency this build does not have.

Re-verify the catalogue against the official gazetteer before these names
are used for anything that settles on-chain.
"""

import io
import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, "src", "data")

TARGET_PARCELS = 999

# Volumetric mean radius, IAU. Used to turn catalogued diameters in km into
# angles on the sphere, and to report what one parcel is actually worth.
MOON_RADIUS_KM = 1737.4

# Equal Earth projection coefficients (Šavrič, Patterson & Jenny, 2018).
A1, A2, A3, A4 = 1.340264, -0.081106, 0.000893, 0.003796

# ---------------------------------------------------------------------------
# The named surface. `kind` drives the map's two-tone albedo: the basalt
# plains read dark, everything else reads as highland. Craters are listed
# alongside the plains they sit in; the smallest containing feature wins.
# (name, kind, lat, lon, diameter_km)
# ---------------------------------------------------------------------------
FEATURES = [
    # --- Basaltic plains: maria, oceanus, sinus, lacus, palus ---
    ("Oceanus Procellarum", "mare", 18.4, -57.4, 2592),
    ("Mare Frigoris", "mare", 56.0, 1.4, 1596),
    ("Mare Imbrium", "mare", 32.8, -15.6, 1145),
    ("Mare Tranquillitatis", "mare", 8.5, 31.4, 875),
    ("Mare Fecunditatis", "mare", -7.8, 51.3, 840),
    ("Mare Nubium", "mare", -21.3, -16.6, 715),
    ("Mare Serenitatis", "mare", 28.0, 17.5, 707),
    ("Mare Australe", "mare", -38.9, 93.0, 603),
    ("Mare Crisium", "mare", 17.0, 59.1, 556),
    ("Mare Insularum", "mare", 7.5, -30.9, 513),
    ("Mare Marginis", "mare", 13.3, 86.1, 420),
    ("Mare Humorum", "mare", -24.4, -38.6, 389),
    ("Lacus Somniorum", "mare", 38.0, 29.2, 384),
    ("Mare Smythii", "mare", 1.3, 87.5, 373),
    ("Mare Cognitum", "mare", -10.0, -23.1, 350),
    ("Mare Nectaris", "mare", -15.2, 35.5, 333),
    ("Mare Orientale", "mare", -19.4, -92.8, 294),
    ("Sinus Aestuum", "mare", 10.9, -8.8, 290),
    ("Sinus Medii", "mare", 2.4, 1.7, 287),
    ("Palus Epidemiarum", "mare", -9.3, -28.2, 286),
    ("Mare Ingenii", "mare", -33.7, 163.5, 282),
    ("Mare Moscoviense", "mare", 27.3, 147.9, 277),
    ("Mare Humboldtianum", "mare", 56.8, 81.5, 273),
    ("Mare Undarum", "mare", 6.8, 68.4, 243),
    ("Mare Vaporum", "mare", 13.3, 3.6, 242),
    ("Sinus Iridum", "mare", 44.1, -31.5, 236),
    ("Sinus Roris", "mare", 54.0, -56.6, 202),
    ("Lacus Mortis", "mare", 45.0, 27.2, 151),
    ("Mare Anguis", "mare", 22.6, 67.7, 150),
    ("Mare Spumans", "mare", 1.1, 65.1, 139),
    # --- Impact basins and large craters ---
    ("South Pole-Aitken Basin", "basin", -53.0, -169.0, 2500),
    ("Hertzsprung", "crater", 1.4, -128.7, 570),
    ("Apollo Basin", "crater", -36.1, -151.8, 537),
    ("Korolev", "crater", -4.0, -157.4, 437),
    ("Poincare", "crater", -56.7, 163.6, 319),
    ("Mendeleev", "crater", 5.7, 140.9, 313),
    ("Schrodinger", "crater", -75.0, 132.4, 312),
    ("Bailly", "crater", -66.5, -69.1, 303),
    ("Gagarin", "crater", -20.2, 149.2, 265),
    ("Clavius", "crater", -58.4, -14.4, 231),
    ("Schickard", "crater", -44.4, -55.1, 212),
    ("Tsiolkovskiy", "crater", -20.4, 129.1, 185),
    ("Fermi", "crater", -19.3, 122.6, 183),
    ("Petavius", "crater", -25.3, 60.4, 177),
    ("Grimaldi", "crater", -5.5, -68.3, 173),
    ("Ptolemaeus", "crater", -9.2, -1.8, 158),
    ("Aitken", "crater", -16.8, 173.4, 135),
    ("Langrenus", "crater", -8.9, 60.9, 132),
    ("Plato", "crater", 51.6, -9.4, 101),
    ("Theophilus", "crater", -11.4, 26.4, 98),
    ("Copernicus", "crater", 9.6, -20.1, 96),
    ("Tycho", "crater", -43.3, -11.4, 85),
    ("Aristarchus", "crater", 23.7, -47.5, 40),
    ("Kepler", "crater", 8.1, -38.0, 31),
]

# ---------------------------------------------------------------------------
# Every place a machine or a person has arrived intact, plus the first
# impact. A parcel that contains one of these says so — it is the one thing
# a lunar grid has that a terrestrial one does not, and it is a matter of
# record rather than invention. (name, operator, year, lat, lon)
# ---------------------------------------------------------------------------
SITES = [
    ("Luna 2", "USSR", 1959, 29.10, 0.00),
    ("Luna 9", "USSR", 1966, 7.08, -64.37),
    ("Surveyor 1", "USA", 1966, -2.47, -43.34),
    ("Apollo 11 — Tranquility Base", "USA", 1969, 0.67, 23.47),
    ("Apollo 12", "USA", 1969, -3.01, -23.42),
    ("Luna 16", "USSR", 1970, -0.68, 56.30),
    ("Luna 17 — Lunokhod 1", "USSR", 1970, 38.24, -35.00),
    ("Apollo 14", "USA", 1971, -3.65, -17.47),
    ("Apollo 15", "USA", 1971, 26.13, 3.63),
    ("Apollo 16", "USA", 1972, -8.97, 15.50),
    ("Apollo 17", "USA", 1972, 20.19, 30.77),
    ("Luna 21 — Lunokhod 2", "USSR", 1973, 25.85, 30.45),
    ("Luna 24", "USSR", 1976, 12.71, 62.21),
    ("Chang'e 3 — Yutu", "CNSA", 2013, 44.12, -19.51),
    ("Chang'e 4 — Yutu-2", "CNSA", 2019, -45.44, 177.60),
    ("Chang'e 5", "CNSA", 2020, 43.06, -51.92),
    ("Chandrayaan-3 — Vikram", "ISRO", 2023, -69.37, 32.32),
    ("Chang'e 6", "CNSA", 2024, -41.63, -153.99),
]


def equal_earth(lon_deg, lat_deg):
    """Longitude/latitude in degrees -> projected x, y (unit sphere radii)."""
    lon = math.radians(lon_deg)
    lat = math.radians(lat_deg)
    theta = math.asin(math.sqrt(3) / 2 * math.sin(lat))
    t2 = theta * theta
    denom = 3 * (9 * A4 * t2**4 + 7 * A3 * t2**3 + 3 * A2 * t2 + A1)
    x = 2 * math.sqrt(3) * lon * math.cos(theta) / denom
    y = A4 * theta**9 + A3 * theta**7 + A2 * theta**3 + A1 * theta
    return x, y


def equal_earth_inverse(x, y, iterations=24):
    """
    Projected x, y -> longitude, latitude in degrees.

    Equal Earth has no closed-form inverse, so theta is solved from y by
    Newton iteration and longitude falls out of x once theta is known. The
    globe needs real spherical coordinates; the projected grid alone cannot
    be draped on a sphere.
    """
    theta = y
    for _ in range(iterations):
        t2 = theta * theta
        fy = A4 * theta**9 + A3 * theta**7 + A2 * theta**3 + A1 * theta - y
        dfy = 9 * A4 * theta**8 + 7 * A3 * theta**6 + 3 * A2 * t2 + A1
        if dfy == 0:
            break
        step = fy / dfy
        theta -= step
        if abs(step) < 1e-13:
            break
    t2 = theta * theta
    denom = 3 * (9 * A4 * t2**4 + 7 * A3 * t2**3 + 3 * A2 * t2 + A1)
    cos_theta = math.cos(theta)
    if abs(cos_theta) < 1e-12:
        lon = 0.0
    else:
        lon = x * denom / (2 * math.sqrt(3) * cos_theta)
    sin_lat = math.sin(theta) * 2 / math.sqrt(3)
    sin_lat = max(-1.0, min(1.0, sin_lat))
    lat = math.asin(sin_lat)
    return math.degrees(lon), math.degrees(lat)


def on_sphere(x, y):
    """
    Is this projected point inside the map outline?

    Equal Earth's boundary is the ±180° meridian, and the inverse maps any
    point beyond it to a longitude outside ±180. So the mask that a
    terrestrial build reads out of a coastline file is, here, the
    projection's own edge — no polygon test and no data file.
    """
    if abs(y) > 1.4:
        return False
    lon, lat = equal_earth_inverse(x, y)
    return -180.0 <= lon <= 180.0 and -90.0 <= lat <= 90.0


def great_circle_deg(lat_a, lon_a, lat_b, lon_b):
    """Angular separation of two lon/lat points, in degrees."""
    phi_a, phi_b = math.radians(lat_a), math.radians(lat_b)
    d_phi = phi_b - phi_a
    d_lam = math.radians(lon_b - lon_a)
    h = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi_a) * math.cos(phi_b) * math.sin(d_lam / 2) ** 2
    )
    return math.degrees(2 * math.asin(min(1.0, math.sqrt(h))))


def km_to_deg(km):
    return math.degrees(km / MOON_RADIUS_KM)


def hex_centres(radius, bounds):
    """
    Flat-top hex lattice. Horizontal step 1.5r, vertical step sqrt(3)r,
    odd columns dropped half a row.
    """
    min_x, min_y, max_x, max_y = bounds
    step_x = 1.5 * radius
    step_y = math.sqrt(3) * radius
    col = 0
    x = min_x
    while x <= max_x + step_x:
        offset = (step_y / 2) if col % 2 else 0
        y = min_y + offset
        while y <= max_y + step_y:
            yield x, y
            y += step_y
        x += step_x
        col += 1


def on_map_fraction(cx, cy, radius):
    """
    Rough share of a hex that falls inside the map outline, by sampling a
    small ring of points inside it. Used only to decide which limb cells to
    drop when the lattice overshoots 999.
    """
    hits = 0
    samples = 0
    for ring_r in (0.35, 0.7):
        for k in range(6):
            angle = math.pi / 3 * k + (0.3 if ring_r > 0.5 else 0)
            px = cx + math.cos(angle) * radius * ring_r
            py = cy + math.sin(angle) * radius * ring_r
            samples += 1
            if on_sphere(px, py):
                hits += 1
    return hits / samples if samples else 0


# Catalogued extents are maximum diameters, which model a round basin well
# and a narrow one badly. For the features the catalogue records as a band
# rather than a basin, the second axis is given here and the feature is
# modelled as an ellipse with its long axis east-west. Mare Frigoris is the
# case that matters: 1596 km end to end but only some 250 km across, so a
# circle of its catalogued diameter would lay a wide band over the whole
# northern nearside and take about three times the parcels it should.
MINOR_AXIS_KM = {
    "Mare Frigoris": 250,
}

# Catalogue pre-resolved to angular semi-axes, smallest first so the tightest
# containing feature wins the parcel. `b` is None for a circle, which keeps
# the exact great-circle test on the common case.
RESOLVED = sorted(
    (
        (
            name,
            kind,
            lat,
            lon,
            km_to_deg(diameter / 2),
            km_to_deg(MINOR_AXIS_KM[name] / 2) if name in MINOR_AXIS_KM else None,
        )
        for name, kind, lat, lon, diameter in FEATURES
    ),
    key=lambda f: f[4] * (f[5] or f[4]),
)


def in_ellipse(lat, lon, f_lat, f_lon, a_deg, b_deg):
    """Local-tangent ellipse test, long axis east-west."""
    d_lat = lat - f_lat
    d_lon = ((lon - f_lon + 180) % 360) - 180
    d_lon *= math.cos(math.radians((lat + f_lat) / 2))
    return (d_lon / a_deg) ** 2 + (d_lat / b_deg) ** 2 <= 1


def feature_at(lat, lon):
    """
    (name, terrain) for a point: the smallest catalogued feature that
    contains it, or the highlands it sits in.
    """
    for name, kind, f_lat, f_lon, a_deg, b_deg in RESOLVED:
        if b_deg is None:
            hit = great_circle_deg(lat, lon, f_lat, f_lon) <= a_deg
        else:
            hit = in_ellipse(lat, lon, f_lat, f_lon, a_deg, b_deg)
        if hit:
            return name, ("mare" if kind == "mare" else "highland")
    return ("Nearside Highlands" if abs(lon) < 90 else "Farside Highlands"), "highland"


def circle_ring(lat_c, lon_c, radius_deg, steps=72):
    """Great-circle circle of `radius_deg` about a point, as lon/lat pairs."""
    phi_c, lam_c = math.radians(lat_c), math.radians(lon_c)
    delta = math.radians(radius_deg)
    ring = []
    for i in range(steps + 1):
        bearing = 2 * math.pi * i / steps
        phi = math.asin(
            math.sin(phi_c) * math.cos(delta)
            + math.cos(phi_c) * math.sin(delta) * math.cos(bearing)
        )
        lam = lam_c + math.atan2(
            math.sin(bearing) * math.sin(delta) * math.cos(phi_c),
            math.cos(delta) - math.sin(phi_c) * math.sin(phi),
        )
        ring.append((math.degrees(lam), math.degrees(phi)))
    return ring


def ellipse_ring(lat_c, lon_c, a_deg, b_deg, steps=72):
    """
    The outline matching `in_ellipse`. Drawn on the local tangent rather
    than as a great-circle figure, which is what the containment test uses
    and is accurate enough for a band a few hundred km across.
    """
    cos_lat = max(0.05, math.cos(math.radians(lat_c)))
    ring = []
    for i in range(steps + 1):
        t = 2 * math.pi * i / steps
        lat = max(-89.9, min(89.9, lat_c + b_deg * math.sin(t)))
        lon = lon_c + (a_deg / cos_lat) * math.cos(t)
        ring.append((((lon + 180) % 360) - 180, lat))
    return ring


def outline_of(name, lat, lon, diameter):
    """Whichever figure the feature is modelled as."""
    if name in MINOR_AXIS_KM:
        return ellipse_ring(
            lat, lon, km_to_deg(diameter / 2), km_to_deg(MINOR_AXIS_KM[name] / 2)
        )
    return circle_ring(lat, lon, km_to_deg(diameter / 2))


def split_at_dateline(ring):
    """
    Cut a ring wherever it crosses ±180° so the flat map does not draw a
    stripe straight across itself. The globe uses the unsplit version.
    """
    parts = []
    current = [ring[0]]
    for prev, point in zip(ring, ring[1:]):
        if abs(point[0] - prev[0]) > 180:
            parts.append(current)
            current = [point]
        else:
            current.append(point)
    parts.append(current)
    return [p for p in parts if len(p) > 3]


def main():
    # The map outline is the projection's own boundary, so the bounds are
    # read off the ±180° meridian rather than off a data file.
    edge = [
        equal_earth(sign * 180.0, lat / 2.0)
        for sign in (-1.0, 1.0)
        for lat in range(-180, 181)
    ]
    xs = [p[0] for p in edge]
    ys = [p[1] for p in edge]
    bounds = (min(xs), min(ys), max(xs), max(ys))
    print(f"map bounds {tuple(round(v, 4) for v in bounds)}")

    # Binary search the hex radius so the on-map cells land just above 999.
    lo, hi = 0.02, 0.4
    best = None
    for _ in range(40):
        radius = (lo + hi) / 2
        centres = [(x, y) for x, y in hex_centres(radius, bounds) if on_sphere(x, y)]
        count = len(centres)
        if count >= TARGET_PARCELS:
            best = (radius, centres)
            lo = radius  # bigger radius -> fewer cells; push for the fewest >= target
        else:
            hi = radius
        if abs(hi - lo) < 1e-6:
            break

    if best is None:
        raise SystemExit("no radius produced enough cells")

    radius, centres = best
    print(f"radius {radius:.6f} -> {len(centres)} cells")

    # Trim the overshoot by dropping the cells that hang furthest off the
    # map outline, which shaves the limb rather than punching holes inland.
    scored = [(on_map_fraction(x, y, radius), x, y) for x, y in centres]
    scored.sort(key=lambda s: (-s[0], s[2], s[1]))
    kept = scored[:TARGET_PARCELS]

    # Number them the way an atlas would: north to south, then west to east.
    kept.sort(key=lambda s: (-s[2], s[1]))

    parcels = []
    for i, (fraction, x, y) in enumerate(kept, start=1):
        lon, lat = equal_earth_inverse(x, y)
        name, terrain = feature_at(lat, lon)

        # Corners are taken from the lattice itself and then unprojected,
        # not rebuilt as a regular hexagon on the sphere. Equal Earth
        # preserves area, not shape, so a hex that is regular here is wider
        # in longitude than in latitude once it is on the globe — redrawing
        # it as a regular spherical hexagon makes every plot overlap its
        # neighbours by about a third. Unprojecting the real corners tiles
        # exactly, which is the whole point of the grid.
        corners = []
        for k in range(6):
            angle = math.pi / 3 * k
            cx = x + radius * math.cos(angle)
            cy = y + radius * math.sin(angle)
            c_lon, c_lat = equal_earth_inverse(cx, cy)
            corners.append([round(c_lon, 3), round(c_lat, 3)])

        parcels.append(
            {
                "id": i,
                "x": round(x, 5),
                "y": round(y, 5),
                "lon": round(lon, 4),
                "lat": round(lat, 4),
                "corners": corners,
                "feature": name,
                "terrain": terrain,
                "side": "near" if abs(lon) < 90 else "far",
                "coverage": round(fraction, 2),
            }
        )

    # Angular radius of a plot on the sphere, measured rather than assumed:
    # invert two points one hex radius apart on the equator and take the
    # longitude difference. The globe draws hexes from this.
    lon_a, _ = equal_earth_inverse(0.0, 0.0)
    lon_b, _ = equal_earth_inverse(radius, 0.0)
    hex_angular_radius = math.radians(abs(lon_b - lon_a))

    # A site belongs to whichever parcel centre it is closest to. The grid is
    # convex and the cells are small, so nearest-centre and
    # inside-the-hexagon agree everywhere that matters.
    site_hits = {}
    for site_name, operator, year, s_lat, s_lon in SITES:
        nearest = min(
            parcels,
            key=lambda p: great_circle_deg(s_lat, s_lon, p["lat"], p["lon"]),
        )
        site_hits.setdefault(nearest["id"], []).append(
            {"name": site_name, "operator": operator, "year": year}
        )
    for parcel in parcels:
        if parcel["id"] in site_hits:
            parcel["sites"] = site_hits[parcel["id"]]

    os.makedirs(OUT_DIR, exist_ok=True)

    surface_km2 = 4 * math.pi * MOON_RADIUS_KM**2
    with io.open(os.path.join(OUT_DIR, "parcels.json"), "w", encoding="utf-8") as f:
        json.dump(
            {
                "total": len(parcels),
                "hexRadius": round(radius, 6),
                "hexAngularRadius": round(hex_angular_radius, 8),
                "bounds": [round(v, 5) for v in bounds],
                "bodyRadiusKm": MOON_RADIUS_KM,
                "parcelAreaKm2": round(surface_km2 / len(parcels)),
                "parcels": parcels,
            },
            f,
            separators=(",", ":"),
            ensure_ascii=False,
        )

    # The maria, as the outlines the map is read by. On the Moon these do
    # the job a coastline does on Earth: they are the only thing that makes
    # the surface legible at a glance.
    flat_rings = []
    lon_lat_rings = []
    for name, kind, lat, lon, diameter in FEATURES:
        if kind != "mare":
            continue
        ring = outline_of(name, lat, lon, diameter)
        lon_lat_rings.append(ring)
        for part in split_at_dateline(ring):
            flat_rings.append([equal_earth(p_lon, p_lat) for p_lon, p_lat in part])

    with io.open(os.path.join(OUT_DIR, "maria.json"), "w", encoding="utf-8") as f:
        json.dump(
            {
                "bounds": [round(v, 5) for v in bounds],
                "rings": [
                    [[round(x, 4), round(y, 4)] for x, y in ring] for ring in flat_rings
                ],
                # The globe drapes the outlines on a sphere, so it needs the
                # original spherical coordinates, not the flattened ones.
                "lonLatRings": [
                    [[round(lon, 3), round(lat, 3)] for lon, lat in ring]
                    for ring in lon_lat_rings
                ],
            },
            f,
            separators=(",", ":"),
            ensure_ascii=False,
        )

    by_feature = {}
    for parcel in parcels:
        by_feature[parcel["feature"]] = by_feature.get(parcel["feature"], 0) + 1
    top = sorted(by_feature.items(), key=lambda kv: -kv[1])[:8]
    mare = sum(1 for p in parcels if p["terrain"] == "mare")
    near = sum(1 for p in parcels if p["side"] == "near")
    placed = sum(len(v) for v in site_hits.values())
    print(f"wrote {len(parcels)} parcels across {len(by_feature)} named regions")
    print(
        f"  {mare} mare / {len(parcels) - mare} highland, "
        f"{near} near / {len(parcels) - near} far"
    )
    print(f"  one parcel = {round(surface_km2 / len(parcels)):,} km2")
    print(f"  mare coverage {mare / len(parcels) * 100:.1f}% of the surface")
    print(f"  {placed} landing sites across {len(site_hits)} parcels")
    print("largest regions:", ", ".join(f"{n} {c}" for c, n in top))


if __name__ == "__main__":
    main()
