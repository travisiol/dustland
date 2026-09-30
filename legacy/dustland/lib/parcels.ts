import parcelData from "@/data/parcels.json";
import mariaData from "@/data/maria.json";

/*
 * The 999 plots and the maria they sit on, generated once by
 * scripts/build-parcels.py and committed. Nothing is projected or fetched
 * at runtime.
 *
 * The globe needs spherical coordinates, and rotating a sphere every frame
 * means turning lon/lat into unit vectors thousands of times a second if it
 * is done naively. So every point on the map — plot centres, the six
 * corners of each plot, every mare outline vertex — is converted to a 3D
 * unit vector exactly once here. Drawing a frame is then a rotation and a
 * cull, with no trigonometry per point.
 */

export interface Parcel {
  id: number;
  x: number;
  y: number;
  lon: number;
  lat: number;
  /** The six lattice corners, unprojected. Six [lon, lat] pairs. */
  corners: [number, number][];
  /** Smallest catalogued feature containing the centre, or the highlands. */
  feature: string;
  /** Basalt plain or highland. The map's only two tones of ground. */
  terrain: "mare" | "highland";
  /** Nearside plots face Earth; farside plots never have. */
  side: "near" | "far";
  /** Share of the plot inside the map outline. Below 1 only at the limb. */
  coverage: number;
  /** Landing and impact sites this plot contains, if any. */
  sites?: { name: string; operator: string; year: number }[];
}

export const parcels = parcelData.parcels as Parcel[];
export const bounds = parcelData.bounds as [number, number, number, number];
export const HEX_RADIUS = parcelData.hexRadius as number;
/** Angular radius of one plot on the sphere, in radians. */
export const HEX_ANGULAR_RADIUS = parcelData.hexAngularRadius as number;
/** Ground in one plot, km². Equal by construction, so this is exact. */
export const PARCEL_AREA_KM2 = parcelData.parcelAreaKm2 as number;
export const BODY_RADIUS_KM = parcelData.bodyRadiusKm as number;

const byId = new Map(parcels.map((parcel) => [parcel.id, parcel]));
export function parcelById(id: number): Parcel | undefined {
  return byId.get(id);
}

// ---- spherical geometry -------------------------------------------------

const DEG = Math.PI / 180;

/** Longitude/latitude in degrees to a unit vector. (0,0) faces the viewer. */
function toVector(lonDeg: number, latDeg: number): [number, number, number] {
  const lon = lonDeg * DEG;
  const lat = latDeg * DEG;
  const cosLat = Math.cos(lat);
  return [cosLat * Math.sin(lon), Math.sin(lat), cosLat * Math.cos(lon)];
}

/** Plot centres as unit vectors, in parcel order. */
export const parcelCentres = new Float64Array(parcels.length * 3);
parcels.forEach((parcel, index) => {
  const [x, y, z] = toVector(parcel.lon, parcel.lat);
  parcelCentres[index * 3] = x;
  parcelCentres[index * 3 + 1] = y;
  parcelCentres[index * 3 + 2] = z;
});

/**
 * Six corners per plot, flattened: parcel i occupies [i*18, i*18+18).
 *
 * These come straight from the generated lattice rather than being rebuilt
 * as regular hexagons around each centre. Equal Earth preserves area, not
 * shape, so a plot covers more longitude than latitude once it is on the
 * globe — drawing it regular overlapped every neighbour by about a third.
 */
export const parcelCorners = new Float64Array(parcels.length * 6 * 3);
parcels.forEach((parcel, index) => {
  parcel.corners.forEach(([lon, lat], k) => {
    const [x, y, z] = toVector(lon, lat);
    const base = index * 18 + k * 3;
    parcelCorners[base] = x;
    parcelCorners[base + 1] = y;
    parcelCorners[base + 2] = z;
  });
});

/**
 * Terrain as a flat lookup, in parcel order.
 *
 * The globe splits every depth band into a basalt pass and a highland pass,
 * so it asks this question three times per parcel per frame. A byte array
 * answers it without touching the parcel objects or comparing strings.
 */
export const parcelIsMare = new Uint8Array(parcels.length);
parcels.forEach((parcel, index) => {
  parcelIsMare[index] = parcel.terrain === "mare" ? 1 : 0;
});

/** Mare outlines as unit vectors. */
const lonLatRings = (mariaData.lonLatRings ?? []) as [number, number][][];
export const mariaVectors: Float64Array[] = lonLatRings.map((ring) => {
  const out = new Float64Array(ring.length * 3);
  ring.forEach(([lon, lat], index) => {
    const [x, y, z] = toVector(lon, lat);
    out[index * 3] = x;
    out[index * 3 + 1] = y;
    out[index * 3 + 2] = z;
  });
  return out;
});

/** Graticule: meridians every 30°, parallels every 30°, as unit vectors. */
export const graticule: Float64Array[] = (() => {
  const lines: Float64Array[] = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const points: number[] = [];
    for (let lat = -80; lat <= 80; lat += 4) points.push(...toVector(lon, lat));
    lines.push(new Float64Array(points));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const points: number[] = [];
    for (let lon = -180; lon <= 180; lon += 4) points.push(...toVector(lon, lat));
    lines.push(new Float64Array(points));
  }
  return lines;
})();
