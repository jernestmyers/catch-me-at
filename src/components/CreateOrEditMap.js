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
  getMapTitle,
  clearTitleAndStatus,
} from "../functions/helperDOMMethods";
import { updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { format } from "date-fns";
import { Link, useLocation } from "react-router-dom";
import { sortObjectByDate } from "../functions/sortObjectByDate";
import sortBounds from "../functions/sortBoundsMethod";

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

// sets the default date to today's date
Date.prototype.toDateInputValue = function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};

const CreateOrEditMap = (props) => {
  // console.log(props);
  let mapToEditData = useLocation().state;
  console.log(mapToEditData);

  const [isMarkerClicked, setIsMarkerClicked] = useState(false);
  const [isEditMarkerClicked, setIsEditMarkerClicked] = useState(false);
  const [idOfMarkerToEdit, setIdOfMarkerToEdit] = useState();
  const [markers, setMarkers] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState({});
  const [markerClickedId, setMarkerClickedId] = useState();

  useEffect(() => {
    if (props.isMapToBeEdited) {
      setMarkers(mapToEditData.markers);
    }
    return () => {
      props.setIsMapToBeEdited(false);
    };
  }, []);

  const resetAndStartOver = () => {
    setIsMarkerClicked(false);
    setMarkers([]);
    props.setIsMapToBeEdited(false);
    setNewMarkerPosition({});
    setMarkerClickedId();
    setPlace(null);
    setPlaceId(null);
    infoWindow.close();
    googleMarker.setVisible(false);
    document.querySelector("#date").value = new Date().toDateInputValue();
    document.querySelector("#time").value = "12:00";
    document.querySelector(`#map-title-input`).value = ``;
    document.querySelector(`#private-checkbox`).checked = null;
    setDefaultBounds(map);
  };

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

  const setDefaultBounds = (map) => {
    const bounds = new window.google.maps.LatLngBounds(
      defaultBounds[0],
      defaultBounds[1]
    );
    map.fitBounds(bounds);
    map.getCenter(bounds);
    setMap(map);
  };

  const onLoad = useCallback(function callback(map) {
    if (!props.isMapToBeEdited) {
      setDefaultBounds(map);
    } else if (props.isMapToBeEdited && mapToEditData.markers.length > 1) {
      const sortedBounds = sortBounds(mapToEditData.markers);
      const bounds = new window.google.maps.LatLngBounds(
        sortedBounds[0],
        sortedBounds[1]
      );
      map.fitBounds(bounds);
      map.getCenter(bounds);
      setMap(map);
    } else if (props.isMapToBeEdited && mapToEditData.markers.length <= 1) {
      map.fitBounds(mapToEditData.markers[0].place.geometry.viewport);
      setMap(map);
    }

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
        if (searchBar.getPlace().place_id) {
          setNewMarkerPosition({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          document.getElementById("search-bar").value = ``;
          googleMarker.setPosition(place.geometry.location);
          googleMarker.setVisible(true);
          infoWindow.setContent(
            `<div>
          <p class="itin-where-text">${place.name}</p>
          <p>${place.formatted_address}</p>
          <a href=${place.url} target="_blank" rel="noreferrer">View on Google Maps</a>
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
        }
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
      updateMapsOwnedInFirestore();
      document.querySelector(`#confirm-add-modal`).style.display = `flex`;
    }
  }, [props.mapsSaved, props.setMapsSaved]);

  const updateMapsOwnedInFirestore = async () => {
    const userRef = doc(props.db, "users", props.userAuth.uid);
    await updateDoc(userRef, {
      mapsOwned: JSON.parse(JSON.stringify(props.mapsSaved)),
    });
  };

  const onMarkerClick = (e) => {
    setMarkerClickedId(e.domEvent.explicitOriginalTarget.title);
    isMarkerClicked ? setIsMarkerClicked(false) : setIsMarkerClicked(true);
  };

  const onMapClick = (e) => {
    if (e.placeId) {
      setPlaceId(e.placeId);
      setNewMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
    googleMarker.setVisible(false);
    setIsMarkerClicked(false);
  };

  const addMarkerAndInfo = (e) => {
    e.preventDefault();
    if (place) {
      const inputFields = document.querySelectorAll(`.input-field`);
      const formData = getFormData(inputFields);
      clearContainer(document.querySelector(`#where-data`));
      clearFormInputs(inputFields);
      setMarkers([
        ...markers,
        {
          id: uniqid(),
          coordinates: newMarkerPosition,
          place: place,
          userInputData: formData,
        },
      ]);
      setIsEditMarkerClicked(false);
      infoWindow.close();
      googleMarker.setVisible(false);
      setPlace(null);
    }
  };

  const deleteMarkerAndData = (e) => {
    console.log(`delete marker`);
    const itemId = e.target.closest(`button`).dataset.itemid;
    console.log(itemId);
    setMarkers(
      markers.filter((marker) => {
        return marker.id !== itemId ? marker : null;
      })
    );
  };

  const prepareToEditMarkerData = (e) => {
    const itemId = e.target.closest(`button`).dataset.itemid;
    console.log(itemId);
    setIsEditMarkerClicked(true);
    setIdOfMarkerToEdit(itemId);
    if (mapToEditData && props.isMapToBeEdited) {
      console.log(`edit existing marker`);
      prepopulateMarkerToEdit(mapToEditData.markers, itemId);
    } else {
      console.log(`edit during creation`);
      prepopulateMarkerToEdit(markers, itemId);
    }
  };

  const prepopulateMarkerToEdit = (markersArray, markerToEditId) => {
    markersArray.filter((marker) => {
      if (marker.id === markerToEditId) {
        setPlace(marker.place);
        document.querySelector("#date").value = marker.userInputData[0].value;
        document.querySelector("#time").value = marker.userInputData[1].value;
        document.querySelector("#what").defaultValue =
          marker.userInputData[2].value;
      }
    });
  };

  const submitEditsToMarker = (e) => {
    e.preventDefault();
    const inputFields = document.querySelectorAll(`.input-field`);
    const formData = getFormData(inputFields);
    clearContainer(document.querySelector(`#where-data`));
    clearFormInputs(inputFields);
    if (mapToEditData && props.isMapToBeEdited) {
      updateMarkersAfterEdit(mapToEditData.markers, idOfMarkerToEdit, formData);
    } else {
      updateMarkersAfterEdit(markers, idOfMarkerToEdit, formData);
    }
    setIsEditMarkerClicked(false);
    setIdOfMarkerToEdit(null);
    setPlace(null);
  };

  const updateMarkersAfterEdit = (markersArray, markerToEditId, inputData) => {
    setMarkers(
      markersArray.map((marker) => {
        if (marker.id === markerToEditId) {
          marker.userInputData = inputData;
          return marker;
        } else {
          return marker;
        }
      })
    );
  };

  const cancelAddOrEditMarker = (e) => {
    e.preventDefault();
    infoWindow.close();
    infoWindow.setContent();
    googleMarker.setVisible(false);
    clearContainer(document.querySelector(`#where-data`));
    clearFormInputs(document.querySelectorAll(`.input-field`));
    setDefaultDate();
    setPlace(null);
    if (e.target.id === `cancel-marker-edit-btn`) {
      console.log(`cancel edits to existing marker`);
      setIsEditMarkerClicked(false);
      setIdOfMarkerToEdit(null);
    }
  };

  const handleSaveMap = (e) => {
    if (markers.length && props.userAuth) {
      if (!props.userAuth.isAnonymous) {
        const mapToUpdate = {
          owner: {
            ownerName: props.userAuth.displayName,
            ownerId: props.userAuth.uid,
          },
          mapID: uniqid(),
          mapTitle: getMapTitle(document.querySelector(`#map-title-input`)),
          markers: markers,
          datePublished: getMapStatusValues().datePublished,
          isPublished: getMapStatusValues().isPublished,
          isPrivate: getMapStatusValues().isPrivate,
          likes: null,
          comments: [],
          sharedWith: [],
        };
        // DOES NOT ACCOUNT FOR CHANGES IN MAP STATUS
        if (!getMapStatusValues().isPrivate) {
          props.setPublicMaps(
            props.publicMaps.concat([
              [mapToUpdate.mapID, { mapObject: mapToUpdate }],
            ])
          );
        }
        props.setMapsSaved([...props.mapsSaved, mapToUpdate]);
        clearTitleAndStatus();
        updatePublicMapsInFirestore(mapToUpdate);
      }
    }
  };

  const updatePublicMapsInFirestore = async (map) => {
    const docRef = doc(props.db, "publicMaps", map.mapID);
    const isMapStoredAsPublic = props.publicMaps
      .map((publicMapObject) => {
        return publicMapObject[0];
      })
      .includes(map.mapID);
    if (!isMapStoredAsPublic && map.isPublished && !map.isPrivate) {
      await setDoc(docRef, {
        mapObject: JSON.parse(JSON.stringify(map)),
      });
    } else if (isMapStoredAsPublic && map.isPublished) {
      map.isPrivate
        ? await deleteDoc(docRef)
        : await updateDoc(docRef, {
            mapObject: JSON.parse(JSON.stringify(map)),
          });
    }
  };

  useEffect(() => {
    setDefaultDate();
  });

  const setDefaultDate = () => {
    const dateInput = document.querySelector("#date");
    const timeInput = document.querySelector("#time");
    if (!timeInput.value) {
      timeInput.value = "12:00";
    }
    if (!dateInput.value) {
      dateInput.value = new Date().toDateInputValue();
    }
  };

  return (
    <div className="map-container" id="create-map-container">
      <div id="start-new-map-container">
        <svg
          id="new-map-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          role="img"
        >
          <path
            data-name="layer2"
            d="M53.832 34.947a26.016 26.016 0 1 0-7.45 15.432"
            fill="none"
            stroke="#6a994e"
            strokeMiterlimit="10"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
          <path
            data-name="layer1"
            fill="none"
            stroke="#6a994e"
            strokeMiterlimit="10"
            strokeWidth="4"
            d="M62 23l-8.168 11.947L43.014 25"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
        <button onClick={resetAndStartOver} id="new-map-btn">
          Start Over
        </button>
      </div>
      {isLoaded ? (
        <div id="map">
          <div id="map-title-input-container">
            <label htmlFor="map-title-input">Map Title:</label>
            <input
              id="map-title-input"
              type="text"
              placeholder={`Untitled - ${format(new Date(), "MM/dd/yyyy")}`}
              defaultValue={
                mapToEditData && props.isMapToBeEdited
                  ? mapToEditData.mapTitle
                  : null
              }
            />
          </div>
          <GoogleMap
            mapContainerStyle={containerStyle}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
          >
            {sortObjectByDate(markers).map((object, index) => {
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
              ? sortObjectByDate(markers).map((object) => {
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
                          <p className="itin-where-text">{object.place.name}</p>
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
      <ItineraryForm
        isEditMarkerClicked={isEditMarkerClicked}
        addMarkerAndInfo={addMarkerAndInfo}
        submitEditsToMarker={submitEditsToMarker}
        cancelAddOrEditMarker={cancelAddOrEditMarker}
      ></ItineraryForm>
      <ViewItinerary
        prepareToEditMarkerData={prepareToEditMarkerData}
        userAuth={props.userAuth}
        deleteMarkerAndData={deleteMarkerAndData}
        markers={markers}
      ></ViewItinerary>
      <div id="status-container">
        {mapToEditData && props.isMapToBeEdited && mapToEditData.isPublished ? (
          <div className="toggle-container">
            <div className="switch-label">
              <svg
                id="checkmark-published"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                role="img"
              >
                <circle
                  data-name="layer2"
                  cx="32"
                  cy="32"
                  r="30"
                  transform="rotate(-45 32 32)"
                  fill="#bdd5ae"
                  stroke="#6a994e"
                  strokeMiterlimit="10"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></circle>
                <path
                  data-name="layer1"
                  fill="none"
                  stroke="#6a994e"
                  strokeMiterlimit="10"
                  strokeWidth="5"
                  d="M20.998 32.015l8.992 8.992 16.011-16.011"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              <p id="mapToEdit-published">Published!</p>
            </div>
            <input type="checkbox" id="publish-checkbox" className="checkbox" />
            {/* <label htmlFor="publish-checkbox" className="switch"></label> */}
          </div>
        ) : (
          <div className="toggle-container">
            <div className="switch-label">
              <p>Publish?</p>
            </div>
            <input type="checkbox" id="publish-checkbox" className="checkbox" />
            <label htmlFor="publish-checkbox" className="switch"></label>
          </div>
        )}
        <div className="toggle-container">
          <div className="switch-label">
            <p>Set as Private?</p>
          </div>
          <input
            className="checkbox"
            type="checkbox"
            id="private-checkbox"
            checked={
              mapToEditData && props.isMapToBeEdited && mapToEditData.isPrivate
                ? `checked`
                : null
            }
          />
          <label htmlFor="private-checkbox" className="switch"></label>
        </div>
        {!mapToEditData || !props.isMapToBeEdited ? (
          <button
            className={
              props.userAuth && props.userAuth.isAnonymous
                ? `disabled disable-create-map`
                : null
            }
            id="save-map-btn"
            onClick={handleSaveMap}
          >
            Save Map
          </button>
        ) : (
          <div id="confirm-edits-btn-container">
            <button
              className="confirm-edits-btn"
              id="save-changes-btn"
              // onClick={handleSaveMap}
            >
              Save Changes
            </button>
            <button
              className="confirm-edits-btn"
              id="cancel-changes-btn"
              onClick={resetAndStartOver}
            >
              Cancel Changes
            </button>
          </div>
        )}
      </div>
      <button
        onClick={() =>
          console.log({
            // newMarker: newMarkerPosition,
            place: place,
            placeId: placeId,
            marker: markers,
            mapToEditData: mapToEditData,
          })
        }
      >
        states checker
      </button>
      <div id="confirm-add-modal">
        <p id="confirm-text">Success!</p>
        <svg
          id="checkmark-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          role="img"
        >
          <circle
            data-name="layer2"
            cx="32"
            cy="32"
            r="30"
            transform="rotate(-45 32 32)"
            fill="#bdd5ae"
            stroke="#6a994e"
            strokeMiterlimit="10"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></circle>
          <path
            data-name="layer1"
            fill="none"
            stroke="#6a994e"
            strokeMiterlimit="10"
            strokeWidth="5"
            d="M20.998 32.015l8.992 8.992 16.011-16.011"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
        {props.mapsSaved.length ? (
          <Link
            to={`../view/${props.mapsSaved[props.mapsSaved.length - 1].mapID}`}
          >
            View your map here!
          </Link>
        ) : null}
        <button
          onClick={() =>
            (document.querySelector(
              `#confirm-add-modal`
            ).style.display = `none`)
          }
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default React.memo(CreateOrEditMap);
