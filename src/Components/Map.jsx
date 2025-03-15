import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchBar from "./SearchBar";

const MapComponent = ({ onLocationSelect }) => {

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  const markerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  
  const polygon = [
    [51.51, -0.12],
    [51.52, -0.14],
    [51.5, -0.15],
  ];

  const searchEventHandler = (result) => {
    console.log("Search result:", result);
    // Extract bounds, name, x, y
    // const bounds = [result.location.bounds[0], result.location.bounds[1]];
    const locationData = {
      display_name: result.label,
      name: result.raw.name,
      x: result.x,
      y: result.y,
      bounds: result.bounds,
    };
    console.log("Selected location:", locationData);
    console.log("Selected display name:", locationData.display_name);
    console.log("Selected name:", locationData.name);
    console.log("Selected x:", locationData.x);
    console.log("Selected y:", locationData.y);
    console.log("Selected bounds:", locationData.bounds[0]);
    console.log("Selected bounds:", locationData.bounds[1]);
    
    setSelectedLocation(locationData);
    setMarkerPosition([result.y, result.x]);

    // Notify parent component
    if (onLocationSelect) {
      onLocationSelect(locationData);
    }
  };

  const addOptionToPoll = async () => {
    if (!selectedLocation) {
      alert("No location selected!");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/poll-options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedLocation),
      });
      if (!response.ok) {
        throw new Error("Failed to add poll option");
      }
      const data = await response.json();
      console.log("Poll option added:", data);
      alert("Location added to poll!");
    } catch (error) {
      console.error("Error adding poll option:", error);
      alert("Error adding location to poll. Please try again.");
    }
  };


  return (
    <>
      <MapContainer
        center={[-33.9173, 151.2313]}
        zoom={13}
        className="w-full h-full"
      >
        <SearchBar onResultSelect={searchEventHandler} />
        <TileLayer
          //differnt tile layers can be used here, e.g.,:
          //most common openstreetmap tiles
          // url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

          // High resolution black and white map
          // url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"

          // toner but lighter version
          // url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"

          // also commom but prettier map
          // url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"

          // water color map omg this is pretty cool
          url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
          attribution='&copy; <a href="https://stamen.com">Stamen Design</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <TileLayer url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png" />
        
        <TileLayer url="https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png" opacity={0.1} />

        {/* <Marker position={[51.505, -0.09]} icon={markerIcon}>
          <Popup>Hello, this is a custom marker!</Popup>
        </Marker> */}

        {markerPosition && (
            <Marker position={markerPosition} icon={markerIcon}>
              <Popup>{selectedLocation?.name || "Selected location"}</Popup>
            </Marker>
          )}

        {/* <Circle
          center={[-33.9173, 151.2313]}
          radius={500}
          color="red"
          fillColor="pink"
        /> */}

        <Polygon positions={polygon} color="blue" />
      </MapContainer>
      {selectedLocation && (
        <div className="mt-4 text-center">
          <p className="text-lg text-gray-700">
            Selected: <strong>{selectedLocation.name}</strong>
          </p>
          <button 
            onClick={addOptionToPoll}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Add to Poll
          </button>
        </div>
      )}
    </>
  );
}

export default MapComponent;
