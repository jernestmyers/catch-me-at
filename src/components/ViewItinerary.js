import React, { useState } from "react";
import uniqid from "uniqid";

const ViewItinerary = (props) => {
  //   console.log(props);
  return (
    <div id="itinerary-container">
      {props.markers.map((object, index) => {
        return (
          <div key={object.id}>
            <h1>thing {index + 1}</h1>
            <p>where: {object.place.name}</p>
            <p>
              when: {object.userInputData[0].value} @{" "}
              {object.userInputData[1].value}
            </p>
            <p>what: {object.userInputData[2].value}</p>
            <button onClick={props.prepareToEditMarkerAndData} id={object.id}>
              edit
            </button>
            <button onClick={props.deleteMarkerAndData} id={index}>
              delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ViewItinerary;
