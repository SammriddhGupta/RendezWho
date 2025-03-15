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

export default function MapComponent() {
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
    <MapContainer
      center={[-33.9173, 151.2313]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <SearchBar />
      <TileLayer
        //differnt tile layers can be used here, e.g.,:
        //most common openstreetmap tiles
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

        // High resolution black and white map
        // url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"

        // toner but lighter version
        // url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"

        // also commom but prettier map
        // url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"

        // water color map omg this is pretty cool
        // url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
        // attribution='&copy; <a href="https://stamen.com">Stamen Design</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      <TileLayer url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png" />
      
      <TileLayer url="https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png" opacity={0.1} />

      <Marker position={[51.505, -0.09]} icon={markerIcon}>
        <Popup>Hello, this is a custom marker!</Popup>
      </Marker>

      <Circle
        center={[-33.9173, 151.2313]}
        radius={500}
        color="red"
        fillColor="pink"
      />

      <Polygon positions={polygon} color="blue" />
    </MapContainer>
  );
}
