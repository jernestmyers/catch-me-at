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
const MyComponent = (props) => {
  const [isMarkerClicked, setIsMarkerClicked] = useState(false);
  const [isMapClicked, setIsMapClicked] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState({});

  useEffect(() => {
    // onLoad(map);
  }, [markers]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API_KEY}`,
    region: `US`,
  });

  const [map, setMap] = React.useState(null);

  const onMarkerClick = (e) => {
    isMarkerClicked ? setIsMarkerClicked(false) : setIsMarkerClicked(true);
  };

  const onMapClick = (e) => {
    console.log(e);
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    setNewMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setAddMarkerButton(e.pixel.x, e.pixel.y);
    // setMarkers([{ lat: e.lat, lng: e.lng }]);
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const setAddMarkerButton = (x, y) => {
    document.querySelector(`#add-marker-btn`).style.display = `block`;
    document.querySelector(`#add-marker-btn`).style.position = `absolute`;
    document.querySelector(`#add-marker-btn`).style.top = `${y}px`;
    document.querySelector(`#add-marker-btn`).style.left = `${x}px`;
    document.querySelector(`#add-marker-btn`).style.zIndex = `1000`;
  };

  const addMarker = () => {
    console.log(newMarkerPosition);
    console.log(markers);
    setMarkers([...markers, newMarkerPosition]);
  };

  return (
    <div id="map">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
        >
          {/* <Marker
            onClick={onMarkerClick}
            position={markerPosition}
            label={markerLabel}
          ></Marker>
          {isMarkerClicked ? (
            <InfoWindow
              position={markerPosition}
              onCloseClick={() => setIsMarkerClicked(false)}
            >
              <div>This is the information in this Window about Marker 1.</div>
            </InfoWindow>
          ) : null} */}
          {markers.map((object, index) => {
            return <Marker label={`${index + 1}`} position={object}></Marker>;
          })}
          <></>
        </GoogleMap>
      ) : (
        <></>
      )}
      <button onClick={addMarker} id="add-marker-btn">
        add marker
      </button>
    </div>
  );
};

export default React.memo(MyComponent);
