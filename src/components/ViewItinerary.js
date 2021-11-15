import React from "react";
import { createWhereElements } from "../functions/helperDOMMethods";

const ViewItinerary = (props) => {
  console.log(props);

  return (
    <div id="itinerary-container">
      {props.markers.map((object, index) => {
        const whereElements = createWhereElements(object.place);
        return (
          <div key={object.id} data-id={object.id}>
            <h1>thing {index + 1}</h1>
            <h2>where</h2>
            <div id="view-where">
              {whereElements[0].innerHTML}
              <br></br>
              {whereElements[1].innerHTML}
              <br></br>
              <a href={whereElements[2].href}>{whereElements[2].innerHTML}</a>
            </div>
            <p>
              when: {object.userInputData[0].value} @{" "}
              {object.userInputData[1].value}
            </p>
            <p>what: {object.userInputData[2].value}</p>
            <button onClick={props.prepareToEditMarkerAndData}>edit</button>
            <button onClick={props.deleteMarkerAndData}>delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default ViewItinerary;
