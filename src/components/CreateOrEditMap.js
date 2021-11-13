import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import uniqid from "uniqid";
import ItineraryForm from "./ItineraryForm";
import ViewItinerary from "./ViewItinerary";
import {
  clearContainer,
  clearFormInputs,
  createWhereElements,
} from "../functions/helperDOMMethods";

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
  const [idOfEditClicked, setIdOfEditClicked] = useState();
  const [markers, setMarkers] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState({});
  const [markerNodeValue, setMarkerNodeValue] = useState();

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

  const fields = [
    `name`,
    `address_component`,
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
            setPlace(place);
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
        const place = searchBar.getPlace();
        setPlace(place);
        setNewMarkerPosition({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        document.getElementById("search-bar").value = ``;
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
      whereContainer.appendChild(elements[0]);
      whereContainer.appendChild(elements[1]);
      whereContainer.appendChild(elements[2]);
    }
    clearFormInputs(document.querySelectorAll(`.input-field`));
  }, [place, newMarkerPosition, setNewMarkerPosition]);
  // !!!!!!---- END: Google Maps API and react-google-maps logic ----!!!!!! //

  // const onMarkerClick = (e) => {
  //   console.log(
  //     +e.domEvent.explicitOriginalTarget.offsetParent.attributes[1].nodeValue
  //   );
  //   setMarkerNodeValue(
  //     +e.domEvent.explicitOriginalTarget.offsetParent.attributes[1].nodeValue
  //   );
  //   isMarkerClicked ? setIsMarkerClicked(false) : setIsMarkerClicked(true);
  //   console.log(infoWindowValues);
  // };

  const onMapClick = (e) => {
    // document.querySelector(`#add-marker-details`).style.display = `none`;
    if (e.placeId) {
      setPlaceId(e.placeId);
      setNewMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleMarkerAndInfo = (e) => {
    const inputFields = document.querySelectorAll(`.input-field`);
    const data = [];
    inputFields.forEach((input) => {
      data.push({ id: input.id, value: input.value });
    });
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
        userInputData: data,
      },
    ]);
    setIsEditClicked(false);
  };

  const deleteMarkerAndData = (e) => {
    setMarkers(
      markers.filter((marker, index) => {
        return index !== +e.target.id ? marker : null;
      })
    );
  };

  const prepareToEditMarkerAndData = (e) => {
    setIsEditClicked(true);
    setIdOfEditClicked(e.target.id);
    const inputFields = document.querySelectorAll(`.input-field`);
    document.querySelector(`#add-marker-details`).style.display = `block`;
    document.querySelector(`#add-marker-details`).style.position = `relative`;
    document.querySelector(`#add-marker-details`).style.left = `0px`;
    document.querySelector(`#add-marker-details`).style.top = `0px`;
  };

  const confirmEditsToMarkerAndData = (e) => {
    e.preventDefault();
    const inputFields = document.querySelectorAll(`.input-field`);
    const data = [];
    inputFields.forEach((input) => {
      data.push({ id: input.id, value: input.value });
      input.value = ``;
    });
    setIsEditClicked(false);
    document.querySelector(`#add-marker-details`).style.display = `none`;
  };

  const handleSaveMap = (e) => {
    if (markers.length) {
      console.log(markers);
      props.setMapsSaved([
        ...props.mapsSaved,
        {
          mapID: uniqid(),
          marker: markers,
        },
      ]);
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
                  // onClick={onMarkerClick}
                  label={`${index + 1}`}
                  position={object.coordinates}
                ></Marker>
              );
            })}
            <></>
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
      <ViewItinerary
        prepareToEditMarkerAndData={prepareToEditMarkerAndData}
        deleteMarkerAndData={deleteMarkerAndData}
        markers={markers}
      ></ViewItinerary>
      <ItineraryForm
        isEditClicked={isEditClicked}
        handleMarkerAndInfo={handleMarkerAndInfo}
        confirmEditsToMarkerAndData={confirmEditsToMarkerAndData}
        // cancelAddMarker={cancelAddMarker}
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
