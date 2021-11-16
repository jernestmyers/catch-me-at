import React from "react";
import { useParams } from "react-router-dom";
import RenderMaps from "./RenderMaps";
import ViewItinerary from "./ViewItinerary";

function ViewMapItinerary(props, match) {
  console.log(props);
  const mapID = useParams()["*"];
  const mapsArray = [...props.userData.mapsOwned];
  console.log(mapsArray);
  console.log(mapID);
  return (
    <div id="detailed-view-container">
      {mapsArray.map((map) => {
        if (mapID === map.mapID) {
          return (
            <div>
              <RenderMaps mapObject={map}></RenderMaps>
              <ViewItinerary
                mapObject={map}
                markers={map.markers}
                userAuth={props.userAuth}
              ></ViewItinerary>
            </div>
          );
        }
      })}
    </div>
  );
}

export default ViewMapItinerary;
