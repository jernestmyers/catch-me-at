import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: 39.9526,
  lng: -75.1652,
};

const markerPosition = {
  lat: 39.9526,
  lng: -75.1652,
};

const markerLabel = `1`;

// function MyComponent() {
const MyComponent = () => {
  const [isClicked, setIsClicked] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API_KEY}`,
    region: `US`,
  });

  const [map, setMap] = React.useState(null);

  const onMarkerClick = () => {
    isClicked ? setIsClicked(false) : setIsClicked(true);
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker
        onClick={onMarkerClick}
        position={markerPosition}
        label={markerLabel}
      ></Marker>
      {isClicked ? (
        <InfoWindow
          position={markerPosition}
          onCloseClick={() => setIsClicked(false)}
        >
          <div>This is the information in this Window about Marker 1.</div>
        </InfoWindow>
      ) : null}
      {/* <InfoWindow position={markerPosition}>
         <div>This is the information in this Window about Marker 1.</div>
       </InfoWindow> */}
      {/* Child components, such as markers, info windows, etc. */}

      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(MyComponent);
