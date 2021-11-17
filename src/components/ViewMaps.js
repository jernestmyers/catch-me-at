import React from "react";
import RenderMaps from "./RenderMaps";
import { Link } from "react-router-dom";

function ViewMaps(props) {
  console.log(props.userData.mapsOwned);
  return (
    <div id="view-maps-container">
      <div id="mapsOwned-container">
        <h2>Your maps:</h2>
        {props.userData.mapsOwned.map((mapObject) => {
          return (
            <div>
              <RenderMaps mapObject={mapObject}></RenderMaps>
            </div>
          );
        })}
      </div>
      <div id="mapsSaved-container"></div>
    </div>
  );
}

export default ViewMaps;
