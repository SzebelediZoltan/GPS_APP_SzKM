import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import { useGeolocation } from "@uidotdev/usehooks";
import { Geolocation } from '@capacitor/geolocation';


const useGeoLocation = async () =>
  {
    return await Geolocation.getCurrentPosition()
  }


export default function MapView() {

  // const state = useGeolocation();
  // console.log(state);
  console.log(useGeoLocation())

  return (
    <MapContainer center={[47.4979, 19.0402]} zoom={13} style={{ height: '100vh' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[47.4979, 19.0402]}>
        <Popup>Helló Budapest!</Popup>
      </Marker>
    </MapContainer>
  )
}
