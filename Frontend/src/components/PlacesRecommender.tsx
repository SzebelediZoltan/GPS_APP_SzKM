import { useState } from "react";
import { model } from "../gemini";
import { Button } from "./ui/button";
import { BrainCircuit, Route } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle } from "./ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export type Place = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

type Props = {
  city: string;
  onPlacesLoaded: (places: Place[]) => void;
};



export default function PlacesRecommender({ city, onPlacesLoaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getPOI() {
    const prompt = `
      Adj 8 érdekes helyet a következő városban: "${city}".
      A válasz kizárólag JSON legyen, formátuma pontosan ez:

      [
        {
          "name": "Hely neve",
          "description": "Rövid leírás",
          "latitude": 0,
          "longitude": 0
        }
      ]

      Ne írj semmi mást a JSON előtt vagy után.
      A koordináták legyenek pontos GPS értékek.
      `;


    getPlaces(prompt)
  }

  async function getRestaurant() {
    const prompt = `
      Adj 8 ajánlott éttermet a következő városban: "${city}".
      A válasz kizárólag JSON legyen, formátuma pontosan ez:

      [
        {
          "name": "Étterem neve",
          "description": "Rövid leírás",
          "latitude": 0,
          "longitude": 0
        }
      ]

      Ne írj semmi mást a JSON előtt vagy után.
      A koordináták legyenek pontos GPS értékek.
      `;


    getPlaces(prompt)
  }

  async function getPrograms() {
    const prompt = `
      Adj lehetöleg 8 érdekes programot vagy látnivalót a következő városban: "${city}".
      A válasz kizárólag JSON legyen, formátuma pontosan ez:

      [
        {
          "name": "Program neve",
          "description": "Rövid leírás",
          "latitude": 0,
          "longitude": 0
        }
      ]

      Ne írj semmi mást a JSON előtt vagy után.
      A koordináták legyenek PONTOS GPS értékek, ha nem azok akkor inkabb ne is küld el.
      `;


    getPlaces(prompt)
  }



  async function getPlaces(prompt: string) {
    try {
      if (!city.trim()) {
        setError("Adj meg egy várost!");
        return;
      }
      setError("");
      setLoading(true);

      


      const result = await model.generateContent(prompt);
      let text = result.response.text();

      // Gemini hajlamos ```json blokkal válaszolni → tisztítás
      const cleaned = text.replace(/```json|```/g, "").trim();

      const places: Place[] = JSON.parse(cleaned);

      onPlacesLoaded(places);
    } catch (err) {
      console.error(err);
      setError("Az AI nem ismeri fel a helyet");
    }

    setLoading(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="absolute -right-22">
          <Button variant="outline">
            {loading ? 
              <Spinner className="text-black" /> :
              <BrainCircuit className='text-black' />
            }
          </Button>
          
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-1000" align="start">
          <DropdownMenuItem onSelect={() => getPOI()}>POI</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => getRestaurant()}>Restaurant</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => getPrograms()}>Programs</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {error != "" ?
        <Alert className='absolute -bottom-11 bg-gray-50 cursor-pointer'>
          <AlertTitle className='text-red-400'>{error}</AlertTitle>
        </Alert> :
        <></>
      }
    </>
  );
}
