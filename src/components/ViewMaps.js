import React from "react";
import RenderMaps from "./RenderMaps";
import { Link } from "react-router-dom";

function ViewMaps(props, match) {
  console.log(props.userData.mapsOwned);
  return (
    <div id="view-maps-container">
      <div id="mapsOwned-container">
        {props.userData.mapsOwned.map((mapObject) => {
          return (
            <div>
              <RenderMaps mapObject={mapObject}></RenderMaps>
              <Link to={`${mapObject.mapID}`}>More details</Link>
            </div>
          );
        })}
      </div>
      <div id="mapsSaved-container"></div>
    </div>
  );
}

export default ViewMaps;
