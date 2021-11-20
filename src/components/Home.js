import React from "react";
import RenderMaps from "./RenderMaps";
import TypewriterEffect from "./TypewriterEffect";

function Home(props) {
  // console.log(props);

  return (
    <div id="home-container">
      {props.userAuth ? (
        <div className="map-feed">
          {props.publicMaps.map((mapArray) => {
            return (
              <div>
                <RenderMaps
                  userAuth={props.userAuth}
                  mapObject={mapArray[1].mapObject}
                ></RenderMaps>
              </div>
            );
          })}
        </div>
      ) : (
        <TypewriterEffect
          userAuth={props.userAuth}
          setUserAuth={props.setuserAuth}
        ></TypewriterEffect>
      )}
    </div>
  );
}

export default Home;
