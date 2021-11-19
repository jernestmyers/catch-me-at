import React, { useEffect } from "react";
import RenderMaps from "./RenderMaps";
import TypewriterEffect from "./TypewriterEffect";
// import { Link } from "react-router-dom";
// import { useParams, useLocation } from "react-router-dom";

function Home(props) {
  console.log(props);

  useEffect(() => {
    // function waitForUserAuth() {
    if (!props.userAuth) {
      document.querySelector(`#typewriter-container`).style.display = `grid`;
      TypewriterEffect();
    }
    if (props.userAuth) {
      document.querySelector(`#typewriter-container`).style.display = `none`;
    }
    // }
    // setTimeout(waitForUserAuth, 5000);
  }, [props.userAuth, props.setUserAuth]);

  return (
    <div id="home-container">
      <div id="typewriter-container">
        <div id="typewriter-prefix">Catch me at&nbsp;</div>
        <div id="typed-text-container">
          <div id="typed-text"></div>
        </div>
      </div>

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
      ) : // <TypewriterEffect></TypewriterEffect>
      null}
    </div>
  );
}

export default Home;
