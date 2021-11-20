import React from "react";
import RenderMaps from "./RenderMaps";
// import { Link } from "react-router-dom";

function ViewMaps(props) {
  // console.log(props.userData.mapsOwned);
  return (
    <div id="view-maps-container">
      {props.userAuth && !props.userAuth.isAnonymous ? (
        <div>
          <div id="user-maps-container">
            <h2>Your maps:</h2>
            {props.userData.mapsOwned.map((mapObject) => {
              return (
                <div>
                  <RenderMaps
                    userAuth={props.userAuth}
                    mapObject={mapObject}
                    // publicMaps={publicMaps}
                  ></RenderMaps>
                </div>
              );
            })}
          </div>
          <div id="user-savedMaps-container"></div>
        </div>
      ) : (
        <div>
          <h1>Sign in with a Google account to view...</h1>
          <ul>
            <li>Maps you create.</li>
            <li>Public maps you save.</li>
            <li>Maps shared with you.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ViewMaps;
