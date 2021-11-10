import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
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
      return a.lat - b.lat;
    })
    .sort((a, b) => {
      return a.lng - b.lng;
    });
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

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
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
          // center={center}
          //   zoom={10}
          options={options}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={(e) => console.log(e)}
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
