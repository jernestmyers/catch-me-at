import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Engagement from "./Engagement";
import { Link, useLocation } from "react-router-dom";
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
  // console.log(props);
  const currentPath = useLocation().pathname;

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
    if (props.mapObject.markers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds(
        sortBounds(props.mapObject.markers)[0].coordinates,
        sortBounds(props.mapObject.markers)[1].coordinates
      );
      map.fitBounds(bounds);
      map.getCenter(bounds);
      setMap(map);
    } else {
      map.fitBounds(props.mapObject.markers[0].place.geometry.viewport);
      setMap(map);
    }
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onMarkerClick = (e) => {
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
                          <a
                            href={object.place.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      </InfoWindow>
                    );
                  }
                })
              : null}
          </GoogleMap>
          <div className="view-map-link-container">
            {currentPath === `/view` ? (
              <Link className="view-map-link" to={`${props.mapObject.mapID}`}>
                {props.mapObject.mapTitle}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  role="img"
                  className="inline-icons"
                >
                  <path
                    className="link-icon"
                    data-name="layer2"
                    fill="none"
                    stroke="#202020"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                    d="M30 62h32V2H2v32"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                  <path
                    className="link-icon"
                    data-name="layer1"
                    fill="none"
                    stroke="#202020"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                    d="M26 56V38H8m18 0L2 62"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </Link>
            ) : (
              <Link
                className="view-map-link"
                to={`/view/${props.mapObject.mapID}`}
              >
                {props.mapObject.mapTitle}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  role="img"
                  className="inline-icons"
                >
                  <path
                    className="link-icon"
                    data-name="layer2"
                    fill="none"
                    stroke="#202020"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                    d="M30 62h32V2H2v32"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                  <path
                    className="link-icon"
                    data-name="layer1"
                    fill="none"
                    stroke="#202020"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                    d="M26 56V38H8m18 0L2 62"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </Link>
            )}
            <div className="map-owner-name">
              by {props.mapObject.owner.ownerName}
            </div>
          </div>
          <Engagement
            likes={props.mapObject.likes}
            comments={props.mapObject.comments}
            mapID={props.mapObject.mapID}
            userAuth={props.userAuth}
          ></Engagement>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(RenderMaps);
