import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import uniqid from "uniqid";
import ItineraryForm from "./ItineraryForm";
import ViewItinerary from "./ViewItinerary";
import {
  clearContainer,
  clearFormInputs,
  createWhereElements,
  appendWhereElements,
  getFormData,
  getMapStatusValues,
} from "../functions/helperDOMMethods";
import {
  // collection,
  // getDocs,
  // getDoc,
  // setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const containerStyle = {
  width: "300px",
  height: "300px",
};

const defaultBounds = [
  // displays the northeast
  {
    lat: 38.393,
    lng: -78.0392,
  },
  { lat: 41.902, lng: -72.4059 },
];

const options = {
  controlSize: 20,
};

const inputStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `300px`,
  height: `24px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
};

const libraries = [`places`];

const CreateOrEditMap = (props) => {
  const [isMarkerClicked, setIsMarkerClicked] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  // const [idOfEditClicked, setIdOfEditClicked] = useState();
  const [markers, setMarkers] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState({});
  const [markerClickedId, setMarkerClickedId] = useState();

  // !!!!!!---- BEGIN: Google Maps API and react-google-maps logic ----!!!!!! //
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API_KEY}`,
    region: `US`,
    libraries: libraries,
  });

  const [map, setMap] = useState(null);
  const [place, setPlace] = useState(null);
  const [placeId, setPlaceId] = useState(null);
  const [searchBar, setSearchBar] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [googleMarker, setGoogleMarker] = useState(null);

  const fields = [
    `name`,
    `formatted_address`,
    `url`,
    `geometry`,
    `type`,
    `place_id`,
  ];

  // BEGIN COMMENT -- this useEffect makes the getDetails request onMapClick
  useEffect(() => {
    if (placeId && placesService) {
      placesService.getDetails(
        { placeId: placeId, fields: fields },
        (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.geometry &&
            place.geometry.location
          ) {
            const geometryObject = Object.assign(place.geometry, {
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            });
            setPlace(
              Object.assign(place, {
                geometry: geometryObject,
              })
            );
          }
        }
      );
    }
  }, [placeId, setPlaceId]);
  // END COMMENT -- this useEffect makes the getDetails request onMapClick

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(
      defaultBounds[0],
      defaultBounds[1]
    );

    const service = new window.google.maps.places.PlacesService(map);
    setPlacesService(service);

    const getInfoWindow = new window.google.maps.InfoWindow();
    setInfoWindow(getInfoWindow);
    const getGoogleMarker = new window.google.maps.Marker({
      map,
      anchorPoint: new window.google.maps.Point(0, -29),
    });
    setGoogleMarker(getGoogleMarker);

    const input = document.getElementById("search-bar");
    const searchBox = new window.google.maps.places.Autocomplete(input, {
      fields: fields,
    });
    setSearchBar(searchBox);

    map.fitBounds(bounds);
    map.getCenter(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (searchBar) {
      searchBar.addListener("place_changed", () => {
        infoWindow.close();
        googleMarker.setVisible(false);
        const place = searchBar.getPlace();
        setNewMarkerPosition({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        document.getElementById("search-bar").value = ``;
        googleMarker.setPosition(place.geometry.location);
        googleMarker.setVisible(true);
        infoWindow.setContent(
          `<div>
          <p>${place.name}</p>
          <p>${place.formatted_address}</p>
          <a href=${place.url}>View on Google Maps</a>
          </div>`
        );
        const geometryObject = Object.assign(place.geometry, {
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        });
        setPlace(
          Object.assign(place, {
            geometry: geometryObject,
          })
        );
        infoWindow.open(map, googleMarker);
      });
    }
  }, [searchBar, setSearchBar]);

  useEffect(() => {
    if (place) {
      map.fitBounds(place.geometry.viewport);
    }
  }, [place, setPlace]);

  useEffect(() => {
    if (place && newMarkerPosition) {
      const whereContainer = document.querySelector(`#where-data`);
      clearContainer(whereContainer);
      const elements = createWhereElements(place);
      appendWhereElements(whereContainer, elements);
    }
    clearFormInputs(document.querySelectorAll(`.input-field`));
  }, [place, newMarkerPosition, setNewMarkerPosition]);
  // !!!!!!---- END: Google Maps API and react-google-maps logic ----!!!!!! //

  useEffect(() => {
    if (markers.length) {
      console.log(`invoke updateFirestore`);
      setMarkers([]);
      setNewMarkerPosition({});
      setPlace(null);
      setPlaceId(null);
      infoWindow.close();
      googleMarker.setVisible(false);
      props.setUserData((prevState) => {
        return { ...prevState, mapsOwned: props.mapsSaved };
      });
      updateFirestore();
    }
  }, [props.mapsSaved, props.setMapsSaved]);

  const updateFirestore = async () => {
    const userRef = doc(props.db, "users", props.userAuth.uid);
    await updateDoc(userRef, {
      mapsOwned: JSON.parse(JSON.stringify(props.mapsSaved)),
    });
  };

  const onMarkerClick = (e) => {
    console.log(e.domEvent.explicitOriginalTarget.title);
    setMarkerClickedId(e.domEvent.explicitOriginalTarget.title);
    isMarkerClicked ? setIsMarkerClicked(false) : setIsMarkerClicked(true);
  };

  const onMapClick = (e) => {
    // document.querySelector(`#add-marker-details`).style.display = `none`;
    if (e.placeId) {
      setPlaceId(e.placeId);
      setNewMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
    googleMarker.setVisible(false);
    setIsMarkerClicked(false);
  };

  const addMarkerAndInfo = (e) => {
    const inputFields = document.querySelectorAll(`.input-field`);
    const formData = getFormData(inputFields);
    clearContainer(document.querySelector(`#where-data`));
    clearFormInputs(inputFields);
    e.preventDefault();
    // document.querySelector(`#add-marker-details`).style.display = `none`;
    setMarkers([
      ...markers,
      {
        id: uniqid(),
        coordinates: newMarkerPosition,
        place: place,
        userInputData: formData,
      },
    ]);
    setIsEditClicked(false);
    infoWindow.close();
    googleMarker.setVisible(false);
  };

  const deleteMarkerAndData = (e) => {
    const markerItineraryContainer = e.target.parentElement.dataset.id;
    setMarkers(
      markers.filter((marker) => {
        return marker.id !== markerItineraryContainer ? marker : null;
      })
    );
  };

  // const prepareToEditMarkerAndData = (e) => {
  //   setIsEditClicked(true);
  //   setIdOfEditClicked(e.target.id);
  //   const inputFields = document.querySelectorAll(`.input-field`);
  //   document.querySelector(`#add-marker-details`).style.display = `block`;
  //   document.querySelector(`#add-marker-details`).style.position = `relative`;
  //   document.querySelector(`#add-marker-details`).style.left = `0px`;
  //   document.querySelector(`#add-marker-details`).style.top = `0px`;
  // };

  // const confirmEditsToMarkerAndData = (e) => {
  //   e.preventDefault();
  //   const inputFields = document.querySelectorAll(`.input-field`);
  //   const data = [];
  //   inputFields.forEach((input) => {
  //     data.push({ id: input.id, value: input.value });
  //     input.value = ``;
  //   });
  //   setIsEditClicked(false);
  //   document.querySelector(`#add-marker-details`).style.display = `none`;
  // };

  const cancelAddMarker = (e) => {
    e.preventDefault();
    infoWindow.close();
    infoWindow.setContent();
    googleMarker.setVisible(false);
    clearContainer(document.querySelector(`#where-data`));
    clearFormInputs(document.querySelectorAll(`.input-field`));
    // document.querySelector(`#add-marker-details`).style.display = `none`;
  };

  const handleSaveMap = (e) => {
    if (markers.length && props.userAuth) {
      if (!props.userAuth.isAnonymous) {
        console.log(markers);
        props.setMapsSaved([
          ...props.mapsSaved,
          {
            ownerId: props.userAuth.uid,
            mapID: uniqid(),
            markers: markers,
            datePublished: getMapStatusValues().datePublished,
            isPublished: getMapStatusValues().isPublished,
            isPrivate: getMapStatusValues().isPrivate,
            likes: null,
            comments: [],
          },
        ]);
      }
    }
  };

  return (
    <div id="map-container">
      {isLoaded ? (
        <div id="map">
          <GoogleMap
            mapContainerStyle={containerStyle}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
          >
            {markers.map((object, index) => {
              return (
                <Marker
                  onClick={onMarkerClick}
                  label={`${index + 1}`}
                  position={object.coordinates}
                  title={object.id}
                ></Marker>
              );
            })}
            {isMarkerClicked
              ? markers.map((object) => {
                  if (object.id === markerClickedId) {
                    return (
                      <InfoWindow
                        position={{
                          lat: object.coordinates.lat,
                          lng: object.coordinates.lng,
                        }}
                        onCloseClick={() => {
                          setIsMarkerClicked(false);
                          setMarkerClickedId(null);
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
          <input
            id="search-bar"
            type="text"
            placeholder="Search for places..."
            style={inputStyle}
          />
        </div>
      ) : (
        <></>
      )}
      {/* <ViewItinerary
        // prepareToEditMarkerAndData={prepareToEditMarkerAndData}
        deleteMarkerAndData={deleteMarkerAndData}
        markers={markers}
      ></ViewItinerary> */}
      <ItineraryForm
        isEditClicked={isEditClicked}
        addMarkerAndInfo={addMarkerAndInfo}
        // confirmEditsToMarkerAndData={confirmEditsToMarkerAndData}
        cancelAddMarker={cancelAddMarker}
      ></ItineraryForm>
      <button onClick={handleSaveMap}>save map</button>
      <button
        onClick={() =>
          console.log({
            map: map,
            place: place,
            searchBar: searchBar,
            placesService: placesService,
            newMarker: newMarkerPosition,
            marker: markers,
          })
        }
      >
        states checker
      </button>
    </div>
  );
};

export default React.memo(CreateOrEditMap);
