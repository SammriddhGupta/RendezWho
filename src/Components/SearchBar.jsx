import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet-geosearch/assets/css/leaflet.css";

const SearchBar = () => {
  const searchControl = new GeoSearchControl({
    provider: new OpenStreetMapProvider(),
    style: "bar",
    resetButton: "🔄",
    searchLabel: "Suggest a meeting place!",
  });

  const map = useMap();

  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
}

export default SearchBar;
