import { useState } from "react";
import { model } from "../gemini";
import { Button } from "./ui/button";
import { BrainCircuit, Route } from "lucide-react";
import { Spinner } from "./ui/spinner";


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



export default function PlacesRecommender({city, onPlacesLoaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getPlaces() {
    if (!city.trim()) {
      setError("Adj meg egy várost!");
      return;
    }
    setError("");
    setLoading(true);

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

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();

      // Gemini hajlamos ```json blokkal válaszolni → tisztítás
      const cleaned = text.replace(/```json|```/g, "").trim();

      const places: Place[] = JSON.parse(cleaned);

      onPlacesLoaded(places);
    } catch (err) {
      console.error(err);
      setError("Nem sikerült betölteni a helyeket.");
    }

    setLoading(false);
  }

  return (
    <Button className='absolute -right-22 bg-gray-50 cursor-pointer hover:bg-muted' onClick={()=> getPlaces()}>
      {loading ? <Spinner className="text-black"/> :
      <BrainCircuit className='text-black'/>
      }  
          </Button>
  );
}
