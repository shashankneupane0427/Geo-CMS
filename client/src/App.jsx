import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.awesome-markers";
import { useEffect, useState } from "react";
import { getAllPlaces } from "../utils/Api";
const markers = [
  {
    geocode: [28.3949, 84.124], // Gandaki Province (Pokhara)
    popUp: "Pokhara",
  },
  {
    geocode: [27.7172, 85.324], // Bagmati Province (Kathmandu)
    popUp: "Kathmandu",
  },
  {
    geocode: [26.455, 87.283], // Province 1 (Biratnagar)
    popUp: "Biratnagar",
  },
  {
    geocode: [27.6766, 83.4323], // Lumbini Province (Butwal)
    popUp: "Butwal",
  },
  {
    geocode: [28.0159, 81.6031], // Sudurpashchim Province (Dhangadhi)
    popUp: "Dhangadhi",
  },
  {
    geocode: [28.2724, 83.5982], // Gandaki Province (Gorkha)
    popUp: "Gorkha",
  },
  {
    geocode: [27.0, 84.8667], // Madhesh Province (Janakpur)
    popUp: "Janakpur",
  },
  {
    geocode: [29.0, 81.25], // Karnali Province (Jumla)
    popUp: "Jumla",
  },
  {
    geocode: [27.5, 85.3333], // Bagmati Province (Bhaktapur)
    popUp: "Bhaktapur",
  },
  {
    geocode: [27.63, 83.87], // Lumbini Province (Lumbini)
    popUp: "Lumbini",
  },
];

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getPlace = async () => {
      const response = await getAllPlaces();
      setData(response.data.data);
    };
    getPlace();
  }, []);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <MapContainer center={[28.3949, 84.124]} zoom={7}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Mapping through the markers */}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default App;
