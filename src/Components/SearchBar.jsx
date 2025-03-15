import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect, useMemo, useRef } from "react";
import "leaflet-geosearch/assets/css/leaflet.css";

const SearchBar = ({ onResultSelect }) => {
  const provider = useMemo(() => new OpenStreetMapProvider(), []);
  const controlRef = useRef(null);

  const searchControl = useMemo(
    () =>
      new GeoSearchControl({
        provider: provider,
        style: "bar",
        showMarker: true,
        showPopup: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,
        searchLabel: "Search for locations",
        resetButton: "🔍",
      }),
    [provider]
  );

  const map = useMap();

  useEffect(() => {
    map.addControl(searchControl);
    controlRef.current = searchControl;

    const handleResults = (e) => {
      if (onResultSelect && e.info === 'resultselected' && e.location) {
        onResultSelect({
          location: {
            label: e.location.label,
            x: e.location.x,
            y: e.location.y,
            bounds: [
              [e.location.bounds.getSouth(), e.location.bounds.getWest()],
              [e.location.bounds.getNorth(), e.location.bounds.getEast()]
            ]
          }
        });
      }
    };

    map.on('geosearch/showlocation', handleResults);
    
    // If an onResultSelect callback is provided, add an event listener
    if (onResultSelect) {
      searchControl.getContainer().addEventListener("results", (event) => {
        const data = event.detail;
        // data.results is an array of results; we'll pass the first result to the callback
        if (data.results && data.results.length > 0) {
          onResultSelect(data.results[0]);
        }
      });
    }

    // Cleanup on unmount: remove the control and event listener
    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleResults);
    };
  }, [map, searchControl, onResultSelect]);

  return null;
}

export default SearchBar;
