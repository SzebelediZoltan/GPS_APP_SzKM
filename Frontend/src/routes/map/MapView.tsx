import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import { useGeolocation } from "@uidotdev/usehooks";
import { Circle } from 'react-leaflet';
import { Riple } from 'react-loading-indicators';
import Header from '@/components/header';

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
