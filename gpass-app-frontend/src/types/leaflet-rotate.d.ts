import * as L from "leaflet"

declare module "leaflet" {
  interface Map {
    setBearing(bearing: number): void
    getBearing(): number
  }

  interface MapOptions {
    rotate?: boolean
    bearing?: number
    touchRotate?: boolean
    rotateControl?: boolean | { closeOnZeroBearing?: boolean }
  }
}
