import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";
import "leaflet.awesome-markers";
import { useEffect, useState } from "react";
import { getAllPlaces } from "../utils/Api";

import L from "leaflet";

function App() {
  const [data, setData] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const getPlace = async () => {
      const response = await getAllPlaces();
      setData(response.data.data);
    };
    getPlace();
  }, []);

  // Fix for default marker icon issue in react-leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // Add global styles for Leaflet elements that can't be targeted with Tailwind directly
    const style = document.createElement("style");
    style.innerHTML = `
      .leaflet-popup-content-wrapper {
        padding: 0 !important;
        overflow: hidden;
        border-radius: 0.5rem !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
      }
      .leaflet-popup-content {
        margin: 0 !important;
        width: 300px !important;
      }
      .custom-popup .leaflet-popup-content {
        width: 320px !important;
      }
      .leaflet-container {
        border-radius: 1rem !important;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (data === null || !data) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Navbar */}
        <Navbar />

        <div className="flex items-center justify-center flex-grow">
          <div className="flex items-center justify-center space-x-3 bg-white p-6 rounded-lg shadow-md">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xl font-semibold text-gray-700">
              Loading map data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to render default image if no images available
  const renderImages = (images) => {
    if (!images || images.length === 0) {
      return (
        <div className="w-full">
          <div className="bg-gray-200 h-40 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-500">No images available</span>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`View of location`}
            className="rounded-t-lg object-cover w-full h-40"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex-grow p-6">
        <div className="h-full w-full overflow-hidden">
          <MapContainer
            center={[28.3949, 84.124]}
            zoom={7}
            className="h-full w-full"
            style={{ borderRadius: "1rem" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MarkerClusterGroup chunkedLoading>
              {data.map((place, index) => (
                <Marker
                  key={index}
                  position={[place.location.latitude, place.location.longitude]}
                  eventHandlers={{
                    click: () => {
                      setSelectedPlace(place);
                    },
                  }}
                >
                  <Popup className="custom-popup" maxWidth="400">
                    <div className="flex flex-col">
                      {renderImages(place.images)}

                      <div className="p-4">
                        <h2 className="text-xl font-bold mb-1 text-gray-900">
                          {place.title}
                        </h2>

                        <div className="flex mb-2">
                          <div className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                            {place.district}
                          </div>
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {place.province}
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 mb-2">
                          <span>Lat: {place.location.latitude}°</span>
                          <span className="ml-2">
                            Long: {place.location.longitude}°
                          </span>
                        </div>

                        <p className="text-sm my-2 text-gray-600 leading-relaxed">
                          {place.description}
                        </p>

                        <div className="flex mt-3">
                          <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center mr-2">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
