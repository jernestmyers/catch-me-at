import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import uniqid from "uniqid";

const containerStyle = {
  width: "300px",
  height: "300px",
};

const center = {
  lat: 39.9526,
  lng: -75.1652,
};

// const inputStyle = {
//   boxSizing: `border-box`,
//   border: `1px solid transparent`,
//   width: `240px`,
//   height: `32px`,
//   padding: `0 12px`,
//   borderRadius: `3px`,
//   boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//   fontSize: `14px`,
//   outline: `none`,
//   textOverflow: `ellipses`,
//   position: "absolute",
//   top: "10px",
//   right: "10px",
// };

const libraries = [`places`];

function sortBounds(array) {
  const sortLatLng = array
    .sort((a, b) => {
      return a.lat - b.lat;
    })
    .sort((a, b) => {
      return a.lng - b.lng;
    });
  //   return [{ sw: sortLatLng[0] }, { ne: sortLatLng[sortLatLng.length - 1] }];
  return [sortLatLng[0], sortLatLng[sortLatLng.length - 1]];
}

const ShowMap = (props) => {
  console.log(props);
  console.log(sortBounds(props.mapObject.marker));
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API_KEY}`,
    region: `US`,
    libraries: libraries,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(
      sortBounds(props.mapObject.marker)[0],
      sortBounds(props.mapObject.marker)[1]
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
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {props.mapObject.marker.map((object, index) => {
            return (
              <Marker label={`${index + 1}`} position={object}>
                <InfoWindow position={object}>
                  <div>
                    <p>where: {props.mapObject.info[index].data[0].value}</p>
                    <p>
                      when: {props.mapObject.info[index].data[1].value} @{" "}
                      {props.mapObject.info[index].data[2].value}
                    </p>
                    <p>what: {props.mapObject.info[index].data[3].value}</p>
                  </div>
                </InfoWindow>
              </Marker>
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

export default React.memo(ShowMap);
