import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import "leaflet-geosearch/assets/css/leaflet.css";

const SearchBar = ({ onResultSelect }) => {
  const searchControl = useMemo(
    () =>
      new GeoSearchControl({
        provider: new OpenStreetMapProvider(),
        style: "bar",
        resetButton: "🔍",
      }),
    []
  );

  const map = useMap();

  useEffect(() => {
    // If a callback is provided, listen to the "results" event
    const handleShowLocation = (e) => {
      // e.location contains the result object:
      // e.location.x, e.location.y, e.location.label, e.location.bounds, etc.
      if (onResultSelect && e && e.location) {
        onResultSelect(e.location);
      }
    };

    // Listen for the "geosearch/showlocation" event on the map
    map.on("geosearch/showlocation", handleShowLocation);

    map.addControl(searchControl);

    // Clean up the control and event listener when the component unmounts
    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation", handleShowLocation);
    };
  }, [map, onResultSelect, searchControl]);

  return null;
};

export default SearchBar;
