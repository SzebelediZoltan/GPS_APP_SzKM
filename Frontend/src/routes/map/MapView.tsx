import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { useGeolocation } from "@uidotdev/usehooks";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import { useState } from 'react';
import L, { map } from "leaflet";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import Routing from '@/components/Routing';
import { Button } from '@/components/ui/button';
import { Route } from 'lucide-react';


type Location = {
  address: {
    "ISO3166-2-lcl-13": string
    "ISO3166-2-lcl-14": string
    country: string
    country_code: string
    postcode: string
    region: string
    state: string
    town: string
  }

  addresstype: string

  boundingbox: [number, number, number, number]

  category: string
  display_name: string
  importance: number

  lat: string
  lon: string

  licence: string
  name: string

  osm_id: number
  osm_type: string

  place_id: number
  place_rank: number

  type: string
}

const baseSearchURL = "https://nominatim.openstreetmap.org/search?"
const params = {
  q: "",
  format: "jsonv2",
  addressdetails: "1"
}

const search = () => {
  const queryString = new URLSearchParams(params).toString()
  console.log(baseSearchURL + queryString);
  return axios.get<Location[]>(baseSearchURL + queryString)
}

export default function MapView() {
  const state = useGeolocation();
  const [searchText, setSearchText] = useState("")
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false)
  const [destination, setDestination] = useState(["", ""])
  const [zoom, setZoom] = useState(0)

  params.q = searchText

  const { data: locations, isLoading } = useQuery({
    queryKey: [searchText],
    queryFn: () => search()
  })
  
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
  
  console.log(zoom);
  
  
  const ownPos = L.icon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW5hdmlnYXRpb24yLWljb24gbHVjaWRlLW5hdmlnYXRpb24tMiI+PHBvbHlnb24gcG9pbnRzPSIxMiAyIDE5IDIxIDEyIDE3IDUgMjEgMTIgMiIvPjwvc3ZnPg==",
    iconSize:     [25, 25], // size of the icon
  })
  
  
  return (
    <>
      <div className='absolute left-5 top-20 z-1000 w-100'>
        <Input type='text' placeholder='Hova' className='relative bg-gray-50' value={searchText} onChange={(event) => {
          setSearchText(event.target.value)
          setHasSelectedLocation(false)
        }} />
        {isLoading && !hasSelectedLocation ? <Spinner className='absolute top-2.5 right-2.5' /> : <></>}
        {hasSelectedLocation && locations? 
          <Button className='absolute -right-11 bg-gray-50 cursor-pointer hover:bg-muted' onClick={() => setDestination([locations.data[0].lat, locations.data[0].lon])}>
            <Route className='text-black'
          /></Button> : <></>}
        <Table className='bg-gray-50 rounded-sm mt-1 select-none' key={searchText}>
          <TableBody>
            {locations?.data.length === 0 && !isLoading && searchText !== "" ?
              <TableRow>
                <TableCell className='text-red-400 font-bold'>
                  Nincs ilyen hely
                </TableCell>
              </TableRow>
              : <></>}

            {!hasSelectedLocation ?
              locations?.data.map((location) =>
                <TableRow key={location.place_id}>
                  <TableCell className='cursor-pointer' onClick={() => {
                    setSearchText(location.display_name)
                    setHasSelectedLocation(true)
                  }}>
                    {location.display_name}
                  </TableCell>
                </TableRow>
              )
              : <></>}
          </TableBody>
        </Table>
      </div>
      <MapContainer center={[state.latitude, state.longitude]} zoom={16.5} minZoom={4} style={{ height: '100vh' }} zoomControl={false}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {destination[0] !== "" ? 
          <Routing from={[state.latitude, state.longitude]} to={[Number(destination[0]), Number(destination[1])]}></Routing>  
          : <Marker icon={ownPos}  position={[state.latitude, state.longitude]}></Marker>}
        
      </MapContainer>
    </>
  )

}
