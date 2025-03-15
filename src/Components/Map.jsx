import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchBar from "./SearchBar";
import VotingBar from "./VotingBar";

const MapComponent = () => {
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

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[-33.9173, 151.2313]}
        zoom={13}
        className="w-full h-full -z-0 "
      >
        
        <SearchBar />
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
          attribution='&copy; <a href="https://stamen.com">Stamen Design</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
         
        />
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png"
          opacity={0.1}
        />

        <Marker position={[-33.9173, 151.2313]} icon={markerIcon}>
          <Popup>Hello, this is a custom marker!</Popup>
        </Marker>
        <Marker position={[-33.9073, 151.2313]} icon={markerIcon}>
          <Popup>Hello, this is a custom marker!</Popup>
        </Marker>

        <Polygon positions={polygon} color="blue" />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
