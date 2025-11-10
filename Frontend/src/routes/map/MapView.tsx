import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import { useGeolocation } from "@uidotdev/usehooks";
import { Circle } from 'react-leaflet';

const fillBlueOptions = { fillColor: 'blue' }


export default function MapView() {

  // const state = useGeolocation();
  // console.log(state);


  const state = useGeolocation();

  console.log(state)

  if (state.loading) {
    return <p>loading... (you may need to enable permissions)</p>;
  }

  if (state.error) {
    return <p>Enable permissions to access your location data</p>;
  }

  if (!state.latitude || !state.longitude || !state.accuracy) {
    return <p>Nincs elérhetö helyadat</p>
  }

  

  return (
    <>
    <MapContainer center={[state.latitude, state.longitude]} zoom={7} style={{ height: '100vh' }} zoomControl={false}>
      <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
      <Circle center={[state.latitude, state.longitude]} pathOptions={fillBlueOptions} radius={state.accuracy} />
      <Marker position={[state.latitude, state.longitude]}>
        <Popup>Helló</Popup>
      </Marker>
    </MapContainer>
    </>
  )
}
