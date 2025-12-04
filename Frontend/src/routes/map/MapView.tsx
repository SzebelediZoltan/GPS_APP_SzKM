import { MapContainer, TileLayer} from 'react-leaflet'
import { useGeolocation } from "@uidotdev/usehooks";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import Routing from "@/components/Routing"; // <-- új import



const fillBlueOptions = { fillColor: 'blue' }


export default function MapView() {

  // const state = useGeolocation();
  // console.log(state);


  const state = useGeolocation();

  console.log(state)

  if (state.error) {
    return <>
      <div className='h-dvh w-dvw flex justify-center items-center'>
        <p className="scroll-m-20 text-center text-2xl tracking-tight mt-1">Enable location permission to this site!</p>
      </div>
    </>;
  }

  if (!state.latitude || !state.longitude || !state.accuracy) {
    return <>
      <div className='h-dvh w-dvw flex justify-center items-center'>
        <p className="scroll-m-20 text-center text-2xl tracking-tight mt-1">Bibi van a szerkezetben!!</p>
      </div>
    </>;
  }

  const destination: [number, number] = [46.253, 20.1414];


  return (
    <>
      <MapContainer center={[state.latitude, state.longitude]} zoom={7} style={{ height: '100vh' }} zoomControl={false}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <Routing from={[state.latitude, state.longitude]} to={destination}  />
      </MapContainer>
    </>
  )
}
