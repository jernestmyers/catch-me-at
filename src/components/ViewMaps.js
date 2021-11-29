import React from "react";
import RenderMaps from "./RenderMaps";
import { Link } from "react-router-dom";

function ViewMaps(props) {
  // console.log(props.userData.mapsOwned);
  return (
    <div id="view-maps-container">
      {props.userAuth && !props.userAuth.isAnonymous ? (
        <div>
          <div className="user-maps-container" id="user-maps">
            <h2 className="view-maps-header">YOUR MAPS</h2>
            {props.userData.mapsOwned.length ? (
              props.userData.mapsOwned.map((mapObject) => {
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
                      mapsSharedWithUser={props.mapsSharedWithUser}
                      setMapsSharedWithUser={props.setMapsSharedWithUser}
                    ></RenderMaps>
                  </div>
                );
              })
            ) : (
              <div className="empty-map-container">
                Looking empty. <Link to="../create">Go create a map!</Link>
              </div>
            )}
          </div>
          <div className="user-maps-container" id="user-savedMaps">
            <h2 className="view-maps-header">MAPS YOU SAVED</h2>
            {props.mapsSavedByUser.length ? (
              props.mapsSavedByUser.map((mapObject) => {
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
                      mapsSharedWithUser={props.mapsSharedWithUser}
                      setMapsSharedWithUser={props.setMapsSharedWithUser}
                    ></RenderMaps>
                  </div>
                );
              })
            ) : (
              <div className="empty-map-container">
                Need inspiration?{" "}
                <Link to="../">Check out the Activity Feed!</Link>
              </div>
            )}
          </div>
          <div className="user-maps-container" id="user-mapsSharedWith">
            <h2 className="view-maps-header">MAPS SHARED WITH YOU</h2>
            {props.mapsSharedWithUser.length ? (
              props.mapsSharedWithUser.map((mapObject) => {
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
                      mapsSharedWithUser={props.mapsSharedWithUser}
                      setMapsSharedWithUser={props.setMapsSharedWithUser}
                    ></RenderMaps>
                  </div>
                );
              })
            ) : (
              <div className="empty-map-container">
                <p>Map creators can share their maps with their connections.</p>
                <br></br>
                <span>
                  <Link to="../connect">Connect with fellow adventurers</Link>{" "}
                  to unlock this potential!
                </span>
              </div>
            )}
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
