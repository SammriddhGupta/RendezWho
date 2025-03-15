import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet-geosearch/assets/css/leaflet.css";


const SearchBar = () => {
  const [ location, setLocation ] = useState({});

  const searchControl = new GeoSearchControl({
    provider: new OpenStreetMapProvider(),
    style: 'bar',
    resetButton: '🔍',
  });

  const map = useMap();

  const searchEventHandler = (result) => {
    const bounds = [];
    bounds.push(result.location.bounds[0]);
    bounds.push(result.location.bounds[1]);

    setLocation({
      name: result.location.label,
      x: result.location.x,
      y: result.location.y,
      bounds: bounds
    });
  }

  useEffect(() => {
    map.addControl(searchControl);
    map.on('geosearch/showlocation', searchEventHandler);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
}

export default SearchBar;
