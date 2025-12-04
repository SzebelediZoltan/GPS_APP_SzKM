import { useState } from "react";
import { model } from "../gemini";

export type Place = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

type Props = {
  onPlacesLoaded: (places: Place[]) => void;
};

export default function PlacesRecommender({ onPlacesLoaded }: Props) {
  const [city, setCity] = useState("");
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
    <div style={{ marginBottom: "20px", fontFamily: "sans-serif" }}>
      <h2>AI Helyajánló</h2>

      <input
        type="text"
        placeholder="Írj be egy várost… (pl. Budapest)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "1rem",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={getPlaces}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Keresés
      </button>

      {loading && <p>⏳ AI gondolkodik…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
