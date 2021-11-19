import React from "react";
import { createWhereElements } from "../functions/helperDOMMethods";
import { useLocation } from "react-router-dom";

const ViewItinerary = (props) => {
  // console.log(props);
  const currentPath = useLocation().pathname;

  const sortedMarkers = props.markers.sort((a, b) => {
    return a.order - b.order;
  });

  return (
    <div id="itinerary-container">
      {sortedMarkers.map((object, index) => {
        const whereElements = createWhereElements(object.place);
        return (
          <div className="itinerary-item" key={object.id} data-id={object.id}>
            <h1>thing {index + 1}</h1>
            <h2>Where</h2>
            <div id="view-where">
              {whereElements[0].innerHTML}
              <br></br>
              {whereElements[1].innerHTML}
              <br></br>
              <a href={whereElements[2].href} target="_blank" rel="noreferrer">
                {whereElements[2].innerHTML}
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
