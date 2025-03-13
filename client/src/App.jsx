import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import "leaflet.awesome-markers";
import { useEffect, useState } from "react";
import { getAllPlaces } from "../utils/Api";

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
  if (data === null || !data) {
    return <>loading</>;
  }

  return (
    <>
      <MapContainer center={[28.3949, 84.124]} zoom={7}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Mapping through the markers */}
        <MarkerClusterGroup chunkedLoading>
          {data.map((place, index) => (
            <Marker
              key={index}
              position={[place.location.latitude, place.location.longitude]}
            >
              <Popup>{place.description}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

export default App;
