import React, { useState, useEffect } from "react";
import RenderMaps from "./RenderMaps";
import { Link, useLocation } from "react-router-dom";
import { collection, getDocs, getDoc, setDoc, doc } from "firebase/firestore";

function User(props) {
  //   console.log(props);
  const userToProfile = useLocation().state;
  const mapsSharedWithMapIds = props.mapsSharedWithUser.map((map) => {
    return map[0];
  });

  const [mapDataToDisplay, setMapDataToDisplay] = useState([]);
  //   const [isRenderReady, setIsRenderReady] = useState(false);

  useEffect(() => {
    getUserMapData();
  }, []);

  //   useEffect(() => {
  //     if (!isRenderReady) {
  //       setIsRenderReady(true);
  //     }
  //   }, [mapDataToDisplay, setMapDataToDisplay]);

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
    <div id="user-container">
      <h2>{userToProfile.userName}</h2>
      <div id="user-public-maps">
        <h3>{userToProfile.userName}'s Public Maps</h3>
        {mapDataToDisplay.length && mapDataToDisplay[0].length
          ? mapDataToDisplay.length
            ? mapDataToDisplay[0].map((map) => {
                return (
                  <div>
                    <RenderMaps
                      mapObject={map}
                      userAuth={props.userAuth}
                      // userData={props.userData}
                    ></RenderMaps>
                  </div>
                );
              })
            : null
          : `nothing to show`}
      </div>
      <div id="user-maps-shared">
        <h3>{userToProfile.userName}'s Maps Shared With You</h3>
        {mapDataToDisplay.length && mapDataToDisplay[1].length
          ? mapDataToDisplay.length
            ? mapDataToDisplay[1].map((map) => {
                return (
                  <div>
                    <RenderMaps
                      mapObject={map}
                      userAuth={props.userAuth}
                      // userData={props.userData}
                    ></RenderMaps>
                  </div>
                );
              })
            : null
          : `nothing to show`}
      </div>
      <button onClick={() => console.log(mapDataToDisplay)}>
        User Profile Data
      </button>
    </div>
  );
}

export default User;
