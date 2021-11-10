import React, { useState } from "react";
import uniqid from "uniqid";

const ViewItinerary = (props) => {
  //   console.log(props);
  return (
    <div id="itinerary-container">
      {props.infoWindowValues.map((object, index) => {
        return (
          <div>
            <h1>thing {index + 1}</h1>
            <p>where: {object.data[0].value}</p>
            <p>
              when: {object.data[1].value} @ {object.data[2].value}
            </p>
            <p>what: {object.data[3].value}</p>
            <button onClick={props.handleEdit} id={object.id}>
              edit
            </button>
            <button onClick={props.handleDelete} id={index}>
              delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ViewItinerary;
