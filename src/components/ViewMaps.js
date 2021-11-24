import React from "react";
import RenderMaps from "./RenderMaps";
// import { Link } from "react-router-dom";

function ViewMaps(props) {
  // console.log(props.userData.mapsOwned);
  return (
    <div id="view-maps-container">
      {props.userAuth && !props.userAuth.isAnonymous ? (
        <div>
          <div className="user-maps-container" id="user-maps">
            <h2 className="view-maps-header">YOUR MAPS</h2>
            {props.userData.mapsOwned.map((mapObject) => {
              return (
                <div>
                  <RenderMaps
                    db={props.db}
                    userAuth={props.userAuth}
                    mapObject={mapObject}
                    publicMaps={props.publicMaps}
                    setPublicMaps={props.setPublicMaps}
                    userData={props.userData}
                    setUserData={props.setUserData}
                    mapsSavedByUser={props.mapsSavedByUser}
                    setMapsSavedByUser={props.setMapsSavedByUser}
                  ></RenderMaps>
                </div>
              );
            })}
          </div>
          <div className="user-maps-container" id="user-savedMaps">
            <h2 className="view-maps-header">MAPS YOU SAVED</h2>
            {props.mapsSavedByUser.map((mapObject) => {
              return (
                <div>
                  <RenderMaps
                    db={props.db}
                    userAuth={props.userAuth}
                    mapObject={mapObject[1].mapObject}
                    publicMaps={props.publicMaps}
                    setPublicMaps={props.setPublicMaps}
                    userData={props.userData}
                    setUserData={props.setUserData}
                    mapsSavedByUser={props.mapsSavedByUser}
                    setMapsSavedByUser={props.setMapsSavedByUser}
                  ></RenderMaps>
                </div>
              );
            })}
          </div>
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
