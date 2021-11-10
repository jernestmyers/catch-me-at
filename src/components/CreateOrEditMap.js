import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  // StandaloneSearchBox,
} from "@react-google-maps/api";
import uniqid from "uniqid";
import ItineraryForm from "./ItineraryForm";
import ViewItinerary from "./ViewItinerary";

const containerStyle = {
  width: "300px",
  height: "300px",
};

const defaultBounds = [
  {
    lat: 38.393,
    lng: -78.0392,
  },
  { lat: 41.902, lng: -72.4059 },
];

const options = {
  controlSize: 20,
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

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(
      defaultBounds[0],
      defaultBounds[1]
    );
    map.fitBounds(bounds);
    map.getCenter(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);
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
    console.log(e);
    setNewMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    if (e.pixel) {
      setAddMarkerButton(e.domEvent.clientX, e.domEvent.clientY);
      setFormDetails(e.domEvent.clientX, e.domEvent.clientY);
    }
  };

  const setAddMarkerButton = (x, y) => {
    document.querySelector(`#add-marker-btn`).style.display = `block`;
    document.querySelector(`#add-marker-btn`).style.position = `absolute`;
    document.querySelector(`#add-marker-btn`).style.left = `${x}px`;
    document.querySelector(`#add-marker-btn`).style.top = `${y}px`;
    document.querySelector(`#add-marker-btn`).style.zIndex = `1000`;
  };

  const setFormDetails = (x, y) => {
    document.querySelector(`#add-marker-details`).style.position = `absolute`;
    document.querySelector(`#add-marker-details`).style.left = `${x}px`;
    document.querySelector(`#add-marker-details`).style.top = `${y}px`;
    document.querySelector(`#add-marker-details`).style.zIndex = `1000`;
  };

  const addMarker = () => {
    document.querySelector(`#add-marker-details`).style.display = `block`;
    document.querySelector(`#add-marker-btn`).style.display = `none`;
  };

  const cancelAdd = (e) => {
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

  const handleDelete = (e) => {
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

  const handleEdit = (e) => {
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

  const editMarker = (e) => {
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
    <div id="map">
      {isLoaded ? (
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
              placeholder="Customized your placeholder"
              style={inputStyle}
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
                  when: {infoWindowValues[markerNodeValue - 1].data[1].value} @{" "}
                  {infoWindowValues[markerNodeValue - 1].data[2].value}
                </p>
                <p>
                  what: {infoWindowValues[markerNodeValue - 1].data[3].value}
                </p>
              </div>
            </InfoWindow>
          ) : null}
          <></>
        </GoogleMap>
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
              <button onClick={handleEdit} id={object.id}>
                edit
              </button>
              <button onClick={handleDelete} id={index}>
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

        <button className="add-details-btn" onClick={cancelAdd}>
          cancel
        </button>
      </form> */}
      <ViewItinerary
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        infoWindowValues={infoWindowValues}
      ></ViewItinerary>
      <ItineraryForm
        isEditClicked={isEditClicked}
        handleMarkerAndInfo={handleMarkerAndInfo}
        editMarker={editMarker}
        cancelAdd={cancelAdd}
      ></ItineraryForm>
      <button onClick={handleSaveMap}>save map</button>
      <button onClick={addMarker} id="add-marker-btn">
        add marker
      </button>
    </div>
  );
};

export default React.memo(CreateOrEditMap);
