import React, { useState, useEffect } from "react";
import RenderMaps from "./RenderMaps";
import { Link, useLocation } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

function User(props) {
  //   console.log(props);
  const userToProfile = useLocation().state;
  const mapsSharedWithMapIds = props.mapsSharedWithUser.map((map) => {
    return map[0];
  });

  const loggedUserActiveConnections = props.userData.connections.active.map(
    (connect) => {
      return connect.userId;
    }
  );
  const loggedUserPendingReceivedConnections =
    props.userData.connections.pendingReceived.map((connect) => {
      return connect.userId;
    });
  const loggedUserPendingSentConnections =
    props.userData.connections.pendingSent.map((connect) => {
      return connect.userId;
    });
  const loggedUserPendingConnections = [
    ...loggedUserPendingReceivedConnections,
    ...loggedUserPendingSentConnections,
  ];
  console.log(loggedUserActiveConnections);
  console.log(loggedUserPendingConnections);

  const [mapDataToDisplay, setMapDataToDisplay] = useState([]);

  useEffect(() => {
    getUserMapData();
  }, []);

  const getUserMapData = async () => {
    const fetchUserData = await getDoc(
      doc(props.db, "users", userToProfile.userId)
    );
    const fetchedUserMaps = fetchUserData.data().mapsOwned;

    const publicMapsForDisplay = fetchedUserMaps.filter((map) => {
      if (!map.isPrivate && !mapsSharedWithMapIds.includes(map.mapID)) {
        return map;
      }
    });
    const sharedMapsForDisplay = fetchedUserMaps.filter((map) => {
      if (mapsSharedWithMapIds.includes(map.mapID)) {
        return map;
      }
    });
    setMapDataToDisplay([publicMapsForDisplay, sharedMapsForDisplay]);
    return [publicMapsForDisplay, sharedMapsForDisplay];
  };

  return (
    <div id="view-maps-container">
      <div id="user-profile-header-container">
        <h2 id="user-profile-header">{userToProfile.userName}</h2>
        {loggedUserActiveConnections.includes(userToProfile.userId) ? (
          <div className="user-profile-connection-status">
            <svg className="guest-icon" viewBox="0 0 64 64" role="img">
              <circle
                data-name="layer2"
                cx="32"
                cy="39"
                r="7"
                fill="#FFEB3B"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></circle>
              <path
                data-name="layer2"
                d="M32 46a12.1 12.1 0 0 0-12 12v2h24v-2a12.1 12.1 0 0 0-12-12z"
                fill="#dfdee3"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <circle
                data-name="layer2"
                cx="52"
                cy="10"
                r="6"
                fill="#FFEB3B"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></circle>
              <path
                data-name="layer2"
                d="M62 28c0-7.5-4.5-12-10-12s-10 4.5-10 12z"
                fill="#bdd5ae"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <circle
                data-name="layer2"
                cx="12"
                cy="10"
                r="6"
                fill="#FFEB3B"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></circle>
              <path
                data-name="layer2"
                d="M22 28c0-7.5-4.5-12-10-12S2 20.5 2 28z"
                fill="#a2bce0"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <path
                data-name="layer1"
                fill="none"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M12 34l8 8m32-8l-8 8M24 14h16"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
            <p className="profile-connect-msg">active connection</p>
          </div>
        ) : (
          <div className="user-profile-connection-status">
            <svg className="guest-icon" viewBox="0 0 64 64" role="img">
              <circle
                data-name="layer2"
                cx="32"
                cy="39"
                r="7"
                fill="#FFEB3B"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></circle>
              <path
                data-name="layer2"
                d="M32 46a12.1 12.1 0 0 0-12 12v2h24v-2a12.1 12.1 0 0 0-12-12z"
                fill="#dfdee3"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <circle
                data-name="layer2"
                cx="52"
                cy="10"
                r="6"
                fill="#FFEB3B"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></circle>
              <path
                data-name="layer2"
                d="M62 28c0-7.5-4.5-12-10-12s-10 4.5-10 12z"
                fill="#bdd5ae"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <circle
                data-name="layer2"
                cx="12"
                cy="10"
                r="6"
                fill="#FFEB3B"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></circle>
              <path
                data-name="layer2"
                d="M22 28c0-7.5-4.5-12-10-12S2 20.5 2 28z"
                fill="#a2bce0"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <path
                data-name="layer1"
                fill="none"
                stroke="#202020"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M12 34l8 8m32-8l-8 8M24 14h16"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
            {loggedUserPendingConnections.includes(userToProfile.userId) ? (
              <div className="profile-connect-msg" id="profile-not-connected">
                <p>pending connection request</p>
                <Link to="../connect">
                  click here to manage your connection requests
                </Link>
              </div>
            ) : (
              <div className="profile-connect-msg" id="profile-not-connected">
                <p id="not-connected-msg">not connected</p>
                <Link to="../connect">
                  go here to send a connection request
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="user-maps-container " id="user-public-maps">
        <h2 className="view-maps-header">PUBLIC MAPS</h2>

        {mapDataToDisplay.length && mapDataToDisplay[0].length ? (
          mapDataToDisplay.length ? (
            mapDataToDisplay[0].map((map, index) => {
              return (
                <div key={`profile-public-map-${index}`}>
                  <RenderMaps
                    mapObject={map}
                    userAuth={props.userAuth}
                  ></RenderMaps>
                </div>
              );
            })
          ) : null
        ) : (
          <div className="empty-map-container">
            <p className="none-pending">nothing to show</p>
          </div>
        )}
      </div>
      <div className="user-maps-container" id="user-maps-shared">
        <h2 className="view-maps-header">MAPS SHARED WITH YOU</h2>
        {mapDataToDisplay.length && mapDataToDisplay[1].length ? (
          mapDataToDisplay.length ? (
            mapDataToDisplay[1].map((map, index) => {
              return (
                <div key={`profile-shared-map-${index}`}>
                  <RenderMaps
                    mapObject={map}
                    userAuth={props.userAuth}
                  ></RenderMaps>
                </div>
              );
            })
          ) : null
        ) : (
          <div className="empty-map-container">
            <p className="none-pending">nothing to show</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
