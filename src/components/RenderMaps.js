import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  // InfoWindow,
} from "@react-google-maps/api";
// import uniqid from "uniqid";

const containerStyle = {
  width: "300px",
  height: "300px",
};

const options = {
  controlSize: 20,
};

const libraries = [`places`];

function sortBounds(array) {
  const sortLatLng = array
    .sort((a, b) => {
      return a.coordinates.lat - b.coordinates.lat;
    })
    .sort((a, b) => {
      return a.coordinates.lng - b.coordinates.lng;
    });
  return [sortLatLng[0], sortLatLng[sortLatLng.length - 1]];
}

const RenderMaps = (props) => {
  console.log(props);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API_KEY}`,
    region: `US`,
    libraries: libraries,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(
      sortBounds(props.mapObject.markers)[0].coordinates,
      sortBounds(props.mapObject.markers)[1].coordinates
    );
    map.fitBounds(bounds);
    map.getCenter(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div id="map">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          options={options}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={(e) => console.log(e)}
        >
          {props.mapObject.markers.map((object, index) => {
            return (
              <Marker
                key={object.id}
                label={`${index + 1}`}
                position={object.coordinates}
              ></Marker>
            );
          })}
          <></>
        </GoogleMap>
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(RenderMaps);
