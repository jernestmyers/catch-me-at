import React from "react";
import RenderMaps from "./RenderMaps";
import { Link } from "react-router-dom";

function ViewMaps(props) {
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
        <div id="guest-container">
          <h1>Sign in with a Google account to view...</h1>
          <ul id="guest-list">
            <li className="guest-list-items">
              <svg
                className="guest-icon"
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
                <ellipse
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  stroke="#202020"
                  fill="#d00000"
                  ry="6"
                  rx="6"
                  cy="20"
                  cx="32"
                  data-name="layer1"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></ellipse>
              </svg>
              Maps you create.
            </li>
            <li className="guest-list-items">
              <svg
                className="guest-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                role="img"
              >
                <path
                  data-name="layer2"
                  fill={"#a2bce0"}
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M31.2 52H2V2h43.3L52 8.7v22.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
                <path
                  data-name="layer2"
                  fill="none"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M44 30.1V28H10v24m24-42v4m8-12v16.3a1.7 1.7 0 0 1-1.7 1.7H23.7a1.7 1.7 0 0 1-1.7-1.7V2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
                <circle
                  data-name="layer1"
                  cx="46"
                  cy="46"
                  r="16"
                  fill={"#bdd5ae"}
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></circle>
                <path
                  data-name="layer1"
                  fill="none"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M46 38v16m-8-8h16"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              Public maps you save.
            </li>
            <li className="guest-list-items">
              <svg
                className="guest-icon"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
              >
                <path
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  stroke="#202020"
                  fill="#bdd5ae"
                  d="M32 22V10l28 20-28 20V38c-11.1 0-21.3.4-30 16 0-9.9 1-32 30-32z"
                  data-name="layer1"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Maps shared with you.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ViewMaps;
