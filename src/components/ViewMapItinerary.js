import React from "react";
import { useParams } from "react-router-dom";
import RenderMaps from "./RenderMaps";
import ViewItinerary from "./ViewItinerary";

function ViewMapItinerary(props) {
  console.log(props.publicMaps);
  console.log(props.mapsSharedWithUser);
  const mapID = useParams()["*"];
  const publicMapsArray = props.publicMaps
    .map((array) => {
      return array[1];
    })
    .map((object) => {
      return object.mapObject;
    });
  const mapsSharedArray = props.mapsSharedWithUser
    .map((array) => {
      return array[1];
    })
    .map((object) => {
      return object.mapObject;
    });

  let mapToDisplay;
  if (props.userAuth && !props.userAuth.isAnonymous) {
    const mapsCombinedArray = [
      ...props.userData.mapsOwned,
      ...publicMapsArray,
      ...mapsSharedArray,
    ];
    // Passing in mapToDisplay[0] prevents duplicate rendering
    mapToDisplay = mapsCombinedArray.filter((map) => {
      if (mapID === map.mapID) {
        return map;
      }
    });
  } else {
    mapToDisplay = [...publicMapsArray];
  }

  return (
    <div id="detailed-view-container">
      <RenderMaps
        db={props.db}
        userAuth={props.userAuth}
        mapObject={mapToDisplay[0]}
        publicMaps={props.publicMaps}
        setPublicMaps={props.setPublicMaps}
        userData={props.userData}
        setUserData={props.setUserData}
        mapsSavedByUser={props.mapsSavedByUser}
        setMapsSavedByUser={props.setMapsSavedByUser}
        mapsSharedWithUser={props.mapsSharedWithUser}
        setMapsSharedWithUser={props.setMapsSharedWithUser}
      ></RenderMaps>
      <ViewItinerary
        mapObject={mapToDisplay[0]}
        markers={mapToDisplay[0].markers}
        userAuth={props.userAuth}
      ></ViewItinerary>
    </div>
  );
}

export default ViewMapItinerary;
