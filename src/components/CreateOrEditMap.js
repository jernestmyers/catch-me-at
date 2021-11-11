import React, { useState, useCallback } from "react";
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
  // backgroundColor: `rgba(0, 0, 0, 0.5)`,
  // color: `white`,
  // fontWeight: `bold`,
  width: `300px`,
  height: `24px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  // position: "relative",
  // top: "30px",
  // left: "5px",
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

  // !!!!!!---- BEGIN: react-google-maps logic ----!!!!!! //
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API_KEY}`,
    region: `US`,
    libraries: libraries,
  });

  const [map, setMap] = useState(null);
  const [place, setPlace] = useState(null);
  const [searchBar, setSearchBar] = useState(null);
  // const [placesService, setPlacesService] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(
      defaultBounds[0],
      defaultBounds[1]
    );

    // const request = {
    //   placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    // };
    // const service = new window.google.maps.places.PlacesService(map);

    // service.getDetails(request, (place, status) => {
    //   if (
    //     status === window.google.maps.places.PlacesServiceStatus.OK &&
    //     place &&
    //     place.geometry &&
    //     place.geometry.location
    //   ) {
    //     const marker = new window.google.maps.Marker({
    //       map,
    //       position: place.geometry.location,
    //     });

    //     window.google.maps.event.addListener(marker, "click", () => {
    //       const content = document.createElement("div");
    //       const nameElement = document.createElement("h2");

    //       nameElement.textContent = place.name;
    //       content.appendChild(nameElement);

    //       const placeIdElement = document.createElement("p");

    //       placeIdElement.textContent = place.place_id;
    //       content.appendChild(placeIdElement);

    //       const placeAddressElement = document.createElement("p");

    //       placeAddressElement.textContent = place.formatted_address;
    //       content.appendChild(placeAddressElement);
    //     });
    //   }
    // });

    map.fitBounds(bounds);
    map.getCenter(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleSearchBar = useCallback(function callback(bar) {
    const input = document.getElementById("search-bar");
    const searchBox = new window.google.maps.places.SearchBox(input);
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      console.log(places);
      console.log(places[0].geometry.location);
      console.log({
        lat: places[0].geometry.location.lat(),
        lng: places[0].geometry.location.lng(),
      });
      console.log(places[0].name);
      setPlace(places);
      input.value = ``;
    });
    // const input = document.getElementById("search-bar");
    // const box = new window.google.maps.places.SearchBox(input);
    // box.addListener("places_changed", handlePlacesData);
    setSearchBar(searchBox);
    // return box.removeListener("places_changed", handlePlacesData);
  }, []);

  // const handlePlacesData = () => {
  //   setPlace(searchBar.getPlaces());
  // };

  // const onSearchBarUnmount = useCallback(function callback(bar) {
  //   setSearchBar(null);
  // }, []);
  // !!!!!!---- END: react-google-maps logic ----!!!!!! //

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
    document.querySelector(`#add-marker-details`).style.display = `none`;
    console.log(e);
    console.log(e.placeId);
    setNewMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    if (e.pixel) {
      positiontoggleAddMarkerButton(e.domEvent.clientX, e.domEvent.clientY);
      positionInfoMarkerForm(e.domEvent.clientX, e.domEvent.clientY);
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
    document.querySelector(`#add-marker-details`).style.display = `block`;
    document.querySelector(`#add-marker-btn`).style.display = `none`;
  };

  const cancelAddMarker = (e) => {
    e.preventDefault();
    setIsEditClicked(false);
    document.querySelector(`#add-marker-details`).style.display = `none`;
  };

  const handleMarkerAndInfo = (e) => {
    const inputFields = document.querySelectorAll(`.input-field`);
    const data = [];
    inputFields.forEach((input) => {
      data.push({ id: input.id, value: input.value });
      input.value = ``;
    });
    e.preventDefault();
    document.querySelector(`#add-marker-details`).style.display = `none`;
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
            {/* <StandaloneSearchBox>
              <input
                id="search-bar"
                type="text"
                placeholder="Search for places..."
                style={inputStyle}
                options={options}
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
              onChange={handleSearchBar}
              // onChange={onSearchBarLoad}
              // onUnmount={onSearchBarUnmount}
              // onChange={(e) => console.log(e.target.value)}
              // onClick={(e) => console.log(e.target.value)}
              // onKeyPress={(e) => console.log(e.target.value)}
            />
          </StandaloneSearchBox>
        </div>
      ) : (
        <></>
      )}
      {/* <div id="itinerary-container">
        {infoWindowValues.map((object, index) => {
          return (
            <div>
              <h1>thing {index + 1}</h1>
              <p>where: {object.data[0].value}</p>
              <p>
                when: {object.data[1].value} @ {object.data[2].value}
              </p>
              <p>what: {object.data[3].value}</p>
              <button onClick={prepareToEditMarkerAndData} id={object.id}>
                edit
              </button>
              <button onClick={deleteMarkerAndData} id={index}>
                delete
              </button>
            </div>
          );
        })}
      </div> */}
      {/* <form id="add-marker-details">
        <div className="form-field">
          <label htmlFor="location">where:</label>
          <input className="input-field" type="text" id="place" />
        </div>
        <div className="form-field">
          <label htmlFor="when">date:</label>
          <input className="input-field" type="date" id="date" />
        </div>
        <div className="form-field">
          <label htmlFor="when-time">time:</label>
          <input className="input-field" type="time" id="time" />
        </div>
        <div className="form-field">
          <label htmlFor="what">the plan:</label>
          <textarea
            className="input-field"
            id="what"
            rows="5"
            cols="50"
          ></textarea>
        </div>
        {!isEditClicked ? (
          <button onClick={handleMarkerAndInfo} className="add-details-btn">
            add
          </button>
        ) : (
          <button onClick={editMarker} id="edit-details-btn">
            confirm edit
          </button>
        )}

        <button className="add-details-btn" onClick={cancelAddMarker}>
          cancel
        </button>
      </form> */}
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
      <button onClick={() => console.log({ place: place, bar: searchBar })}>
        search bar
      </button>
    </div>
    // </div>
  );
};

export default React.memo(CreateOrEditMap);
