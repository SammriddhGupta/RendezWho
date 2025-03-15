import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
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
    // If an onResultSelect callback is provided, add an event listener
    if (onResultSelect) {
      searchControl.on("results", (data) => {
        // data.results is an array of results; we'll pass the first result to the callback
        if (data.results && data.results.length > 0) {
          onResultSelect(data.results[0]);
        }
      });
    }

    map.addControl(searchControl);

    // Cleanup on unmount: remove the control and event listener
    return () => {
      map.removeControl(searchControl);
      if (onResultSelect) {
        searchControl.off("results");
      }
    };
  }, [map, onResultSelect, searchControl]);

  return null;
}

export default SearchBar;
