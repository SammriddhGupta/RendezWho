import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchBar from "./SearchBar";
import AddPollOption from "./AddPollOption";

const MapComponent = ({ onLocationSelect, onOptionAdded, eventId, }) => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupLocation, setPopupLocation] = useState(null);
  const markerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const searchEventHandler = (result) => {
    console.log("Search result:", result);

    const locationData = {
      display_name: result.label,
      name: result.raw.name || "Selected Location",
      x: result.x,
      y: result.y,
      bounds: result.bounds,
    };

    console.log("Selected location:", locationData);
    setSelectedLocations((prevLocations) => [...prevLocations, locationData]); // Add new marker
    setPopupLocation(locationData);
    setPopupOpen(true); 

    if (onLocationSelect) {
      onLocationSelect(locationData);
    }
  };

  return (
    <MapContainer
      center={[-33.9173, 151.2313]}
      zoom={13}
      className="w-full h-full"
    >
      <SearchBar onResultSelect={searchEventHandler} />

      {/* Stamen Watercolor Map */}
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
        attribution='&copy; <a href="https://stamen.com">Stamen Design</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Overlay Labels for Watercolor Map */}
      <TileLayer url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png" />
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png"
        opacity={0.1}
      />

      {/* Marker appears automatically when location is selected */}
      {selectedLocations.map((location, index) => (
        <Marker
          key={index}
          position={[location.y, location.x]}
          icon={markerIcon}
        >
          <AutoPopup open={popupLocation} setOpen={setPopupLocation}>
            <h3 className="font-bold text-center">{location.name}</h3>
          
              <AddPollOption
                eventId={eventId}
                selectedLocation={location}
                onOptionAdded={onOptionAdded}
              />
            
          </AutoPopup>
        </Marker>
      ))}
    </MapContainer>
  );
};

/**
 * Automatically opens a Popup when a location is selected
 */
const AutoPopup = ({ children, open, setOpen }) => {
  const map = useMap();
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const popups = document.querySelectorAll(".leaflet-popup");
        if (popups.length) {
          popups[0].classList.add("leaflet-popup-open");
        }
        setOpen(false); // Prevent repeated opening
      }, 100);
    }
  }, [open, setOpen, map]);

  return <Popup autoOpen={true}>{children}</Popup>;
};

export default MapComponent;
