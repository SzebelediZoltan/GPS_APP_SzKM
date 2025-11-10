import { useMap, MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import { useGeolocation } from "@uidotdev/usehooks";
import { Circle } from 'react-leaflet';
import { Riple } from 'react-loading-indicators';
import Header from '@/components/header';
import React, { useEffect } from "react";
import "leaflet-routing-machine";
import L from "leaflet";
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
        <Circle 
        center={[state.latitude, state.longitude]} 
        pathOptions={fillBlueOptions} 
        radius={state.accuracy} />
        <Marker position={[state.latitude, state.longitude]}>
          <Popup>Helló</Popup>
        </Marker>

        <Routing from={[state.latitude, state.longitude]} to={destination}  />
      </MapContainer>
    </>
  )
}
