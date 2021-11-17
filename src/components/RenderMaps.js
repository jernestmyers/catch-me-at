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
  const [isMarkerClickedInRender, setIsMarkerClickedInRender] = useState();
  const [markerClickedIdInRender, setMarkerClickedIdInRender] = useState();

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

  const onMarkerClick = (e) => {
    console.log(e.domEvent.explicitOriginalTarget.title);
    setMarkerClickedIdInRender(e.domEvent.explicitOriginalTarget.title);
    isMarkerClickedInRender
      ? setIsMarkerClickedInRender(false)
      : setIsMarkerClickedInRender(true);
  };

  const onMapClick = (e) => {
    setIsMarkerClickedInRender(false);
  };

  return (
    <div className="map-container" id="render-map-container">
      {isLoaded ? (
        <div id="map">
          <h1>{props.mapObject.mapTitle}</h1>
          <GoogleMap
            mapContainerStyle={containerStyle}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
          >
            {props.mapObject.markers.map((object, index) => {
              return (
                <Marker
                  onClick={onMarkerClick}
                  label={`${index + 1}`}
                  position={object.coordinates}
                  title={object.id}
                ></Marker>
              );
            })}
            {isMarkerClickedInRender
              ? props.mapObject.markers.map((object) => {
                  if (object.id === markerClickedIdInRender) {
                    return (
                      <InfoWindow
                        position={{
                          lat: object.coordinates.lat,
                          lng: object.coordinates.lng,
                        }}
                        onCloseClick={() => {
                          setIsMarkerClickedInRender(false);
                          setMarkerClickedIdInRender(null);
                        }}
                      >
                        <div>
                          <p>{object.place.name}</p>
                          <p>{object.place.formatted_address}</p>
                          <a href={object.place.url}>View on Google Maps</a>
                        </div>
                      </InfoWindow>
                    );
                  }
                })
              : null}
          </GoogleMap>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(RenderMaps);
