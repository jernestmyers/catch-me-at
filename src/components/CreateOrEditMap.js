import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import uniqid from "uniqid";
import ItineraryForm from "./ItineraryForm";
import ViewItinerary from "./ViewItinerary";

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
  const [infoWindowValues, setInfoWindowValues] = useState([]);

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

  useEffect(() => {
    if (placeId && placesService) {
      const request = {
        placeId: `${placeId}`,
      };
      placesService.getDetails(request, (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          console.log({ serviceRequest: place });
          setPlace(place);
        }
      });
    }
  }, [placeId, setPlaceId]);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(
      defaultBounds[0],
      defaultBounds[1]
    );

    const service = new window.google.maps.places.PlacesService(map);
    setPlacesService(service);

    const input = document.getElementById("search-bar");
    const searchBox = new window.google.maps.places.SearchBox(input);
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
      searchBar.addListener("places_changed", () => {
        const places = searchBar.getPlaces();
        console.log(places);
        console.log({
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng(),
        });
        console.log(places[0].name);
        console.log(places[0].formatted_address);
        console.log(places[0].url);
        setPlace(places[0]);
        setNewMarkerPosition({
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng(),
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
      document.querySelector(`#where`).value =
        place.name +
        "\n" +
        place.formatted_address +
        "\n" +
        place.website +
        "\n" +
        place.url;
    }
  }, [place, newMarkerPosition, setNewMarkerPosition]);
  // !!!!!!---- END: Google Maps API and react-google-maps logic ----!!!!!! //

  const onMarkerClick = (e) => {
    console.log(
      +e.domEvent.explicitOriginalTarget.offsetParent.attributes[1].nodeValue
    );
    setMarkerNodeValue(
      +e.domEvent.explicitOriginalTarget.offsetParent.attributes[1].nodeValue
    );
    isMarkerClicked ? setIsMarkerClicked(false) : setIsMarkerClicked(true);
    console.log(infoWindowValues);
  };

  const onMapClick = (e) => {
    // document.querySelector(`#add-marker-details`).style.display = `none`;
    console.log(e);
    console.log({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    if (e.placeId) {
      console.log(e.placeId);
      setPlaceId(e.placeId);
    }
    setNewMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    if (e.pixel) {
      positiontoggleAddMarkerButton(e.domEvent.clientX, e.domEvent.clientY);
      // positionInfoMarkerForm(e.domEvent.clientX, e.domEvent.clientY);
    }
  };

  const positiontoggleAddMarkerButton = (x, y) => {
    document.querySelector(`#add-marker-btn`).style.display = `block`;
    document.querySelector(`#add-marker-btn`).style.position = `absolute`;
    document.querySelector(`#add-marker-btn`).style.left = `${x}px`;
    document.querySelector(`#add-marker-btn`).style.top = `${y}px`;
    document.querySelector(`#add-marker-btn`).style.zIndex = `1000`;
  };

  const positionInfoMarkerForm = (x, y) => {
    document.querySelector(`#add-marker-details`).style.position = `absolute`;
    document.querySelector(`#add-marker-details`).style.left = `${x}px`;
    document.querySelector(`#add-marker-details`).style.top = `${y}px`;
    document.querySelector(`#add-marker-details`).style.zIndex = `1000`;
  };

  const toggleAddMarker = () => {
    // document.querySelector(`#add-marker-details`).style.display = `block`;
    document.querySelector(`#add-marker-btn`).style.display = `none`;
  };

  const cancelAddMarker = (e) => {
    e.preventDefault();
    setIsEditClicked(false);
    // document.querySelector(`#add-marker-details`).style.display = `none`;
  };

  const handleMarkerAndInfo = (e) => {
    const inputFields = document.querySelectorAll(`.input-field`);
    const data = [];
    inputFields.forEach((input) => {
      data.push({ id: input.id, value: input.value });
      input.value = ``;
    });
    e.preventDefault();
    // document.querySelector(`#add-marker-details`).style.display = `none`;
    setMarkers([...markers, newMarkerPosition]);
    setInfoWindowValues([...infoWindowValues, { id: uniqid(), data }]);
    setIsEditClicked(false);
  };

  const deleteMarkerAndData = (e) => {
    setMarkers(
      markers.filter((marker, index) => {
        return index !== +e.target.id ? marker : null;
      })
    );
    setInfoWindowValues(
      infoWindowValues.filter((data, index) => {
        return index !== +e.target.id ? data : null;
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
    infoWindowValues.filter((object) => {
      if (object.id === e.target.id) {
        console.log(object);
        inputFields[0].value = object.data[0].value;
        inputFields[1].value = object.data[1].value;
        inputFields[2].value = object.data[2].value;
        inputFields[3].value = object.data[3].value;
      }
    });
  };

  const confirmEditsToMarkerAndData = (e) => {
    e.preventDefault();
    const inputFields = document.querySelectorAll(`.input-field`);
    const data = [];
    inputFields.forEach((input) => {
      data.push({ id: input.id, value: input.value });
      input.value = ``;
    });
    setInfoWindowValues(
      infoWindowValues.map((object) => {
        if (object.id === idOfEditClicked) {
          return { id: object.id, data };
        } else {
          return object;
        }
      })
    );
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
          info: infoWindowValues,
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
            // center={center}
            // zoom={10}
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
                  position={object}
                ></Marker>
              );
            })}
            {isMarkerClicked ? (
              <InfoWindow
                position={markers[markerNodeValue - 1]}
                onCloseClick={() => setIsMarkerClicked(false)}
              >
                <div>
                  <p>
                    where: {infoWindowValues[markerNodeValue - 1].data[0].value}
                  </p>
                  <p>
                    when: {infoWindowValues[markerNodeValue - 1].data[1].value}{" "}
                    @ {infoWindowValues[markerNodeValue - 1].data[2].value}
                  </p>
                  <p>
                    what: {infoWindowValues[markerNodeValue - 1].data[3].value}
                  </p>
                </div>
              </InfoWindow>
            ) : null}
            <></>
          </GoogleMap>
          <StandaloneSearchBox>
            <input
              id="search-bar"
              type="text"
              placeholder="Search for places..."
              style={inputStyle}
              // onLoad={handleSearchBar}
            />
          </StandaloneSearchBox>
        </div>
      ) : (
        <></>
      )}
      <ViewItinerary
        prepareToEditMarkerAndData={prepareToEditMarkerAndData}
        deleteMarkerAndData={deleteMarkerAndData}
        infoWindowValues={infoWindowValues}
      ></ViewItinerary>
      <ItineraryForm
        isEditClicked={isEditClicked}
        handleMarkerAndInfo={handleMarkerAndInfo}
        confirmEditsToMarkerAndData={confirmEditsToMarkerAndData}
        cancelAddMarker={cancelAddMarker}
      ></ItineraryForm>
      <button onClick={handleSaveMap}>save map</button>
      <button onClick={toggleAddMarker} id="add-marker-btn">
        add marker
      </button>
      <button
        onClick={() =>
          console.log({
            map: map,
            place: place,
            searchBar: searchBar,
            placesService: placesService,
            newMarker: newMarkerPosition,
          })
        }
      >
        states checker
      </button>
    </div>
  );
};

export default React.memo(CreateOrEditMap);
