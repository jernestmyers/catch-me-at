import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  StandaloneSearchBox,
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

const inputStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  position: "absolute",
  top: "10px",
  right: "10px",
};

const libraries = [`places`];

const MyComponent = (props) => {
  const [isMarkerClicked, setIsMarkerClicked] = useState(false);
  const [isMapClicked, setIsMapClicked] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState({});
  const [markerNodeValue, setMarkerNodeValue] = useState();

  useEffect(() => {
    // window.addEventListener(`click`, getNodeValue);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API_KEY}`,
    region: `US`,
    libraries: libraries,
  });

  const [map, setMap] = React.useState(null);

  const onMarkerClick = (e) => {
    console.log(
      +e.domEvent.explicitOriginalTarget.offsetParent.attributes[1].nodeValue
    );
    setMarkerNodeValue(
      +e.domEvent.explicitOriginalTarget.offsetParent.attributes[1].nodeValue
    );
    isMarkerClicked ? setIsMarkerClicked(false) : setIsMarkerClicked(true);
  };

  const onMapClick = (e) => {
    console.log(e);
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    setNewMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    if (e.pixel) {
      setAddMarkerButton(e.pixel.x, e.pixel.y);
    }
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
          {/* <StandaloneSearchBox>
            <input
              id="search-bar"
              type="text"
              placeholder="Customized your placeholder"
              style={inputStyle}
            />
          </StandaloneSearchBox> */}

          {markers.map((object, index) => {
            return (
              <Marker
                onClick={onMarkerClick}
                label={`${index + 1}`}
                position={object}
              ></Marker>
            );
          })}
          {isMarkerClicked ? (
            <InfoWindow
              position={markers[markerNodeValue - 1]}
              onCloseClick={() => setIsMarkerClicked(false)}
            >
              <div>This is Window {markerNodeValue}.</div>
            </InfoWindow>
          ) : null}
          <></>
        </GoogleMap>
      ) : (
        <></>
      )}
      <form id="add-marker-details">
        <div className="form-field">
          <label htmlFor="location">where:</label>
          <input type="text" id="place" />
        </div>
        <div className="form-field">
          <label htmlFor="when">date:</label>
          <input type="date" id="when" />
        </div>
        <div className="form-field">
          <label htmlFor="when-time">time:</label>
          <input type="time" id="when-time" />
        </div>
        <div className="form-field">
          <label htmlFor="what">the plan:</label>
          <textarea id="what" rows="5" cols="50"></textarea>
        </div>
      </form>
      <button onClick={addMarker} id="add-marker-btn">
        add marker
      </button>
    </div>
  );
};

export default React.memo(MyComponent);
