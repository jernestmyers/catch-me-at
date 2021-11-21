import React from "react";
import { createWhereElements } from "../functions/helperDOMMethods";
import { useLocation } from "react-router-dom";

const ViewItinerary = (props) => {
  // console.log(props);
  const currentPath = useLocation().pathname;

  const sortedMarkers = [...props.markers];
  sortedMarkers.sort((a, b) => {
    return a.order - b.order;
  });

  return (
    <div id="itinerary-container">
      {sortedMarkers.map((object) => {
        const whereElements = createWhereElements(object.place);
        return (
          <div className="itinerary-item" key={object.id} data-id={object.id}>
            <h1 className="marker-header-number">{object.order}</h1>
            <svg
              className="marker-details-header"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
            >
              <path
                d="M38.1 46H52l8 16H4l8-16h13.9"
                strokeWidth="2"
                strokeMiterlimit="10"
                stroke="#202020"
                fill="#A2BCE0"
                data-name="layer2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <path
                strokeWidth="2"
                strokeMiterlimit="10"
                stroke="#202020"
                fill="red"
                d="M32 2a18.1 18.1 0 0 0-18.1 18.1C13.9 36.4 32 52.4 32 52.4s18.1-16 18.1-32.3A18.1 18.1 0 0 0 32 2z"
                data-name="layer1"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
            <h2>Where</h2>
            <div id="view-where">
              <p>{whereElements[0].innerText}</p>
              <p>{whereElements[1].innerText}</p>
              <a href={whereElements[2].href} target="_blank" rel="noreferrer">
                {whereElements[2].innerText}
              </a>
            </div>
            <h2>When</h2>
            <div>
              <p>
                {object.userInputData[0].value} @{" "}
                {object.userInputData[1].value}
              </p>
            </div>
            <h2>What</h2>
            <div>
              <p>{object.userInputData[2].value}</p>
            </div>
            {currentPath === "/create" ? (
              <div>
                <button onClick={props.prepareToEditMarkerAndData}>edit</button>
                <button onClick={props.deleteMarkerAndData}>delete</button>
              </div>
            ) : props.userAuth.uid === props.mapObject.owner.ownerId ? (
              <div>
                <button onClick={props.prepareToEditMarkerAndData}>edit</button>
                <button onClick={props.deleteMarkerAndData}>delete</button>
              </div>
            ) : null}
            {/* <button onClick={props.prepareToEditMarkerAndData}>edit</button>
            <button onClick={props.deleteMarkerAndData}>delete</button> */}
          </div>
        );
      })}
    </div>
  );
};

export default ViewItinerary;
