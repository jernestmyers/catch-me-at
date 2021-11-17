import React from "react";
import RenderMaps from "./RenderMaps";
import { Link } from "react-router-dom";
// import { useParams, useLocation } from "react-router-dom";

function Home(props) {
  console.log(props);

  return (
    <div id="home-container">
      <h1>HOME</h1>
      {props.userAuth ? (
        <div>
          <h1>This is Home when logged in, even as a guest.</h1>
          {props.publicMaps.map((mapArray) => {
            return (
              <div>
                <RenderMaps mapObject={mapArray[1].mapObject}></RenderMaps>
              </div>
            );
          })}
        </div>
      ) : (
        <h1>This is Home when NOT logged in.</h1>
      )}
    </div>
  );
}

export default Home;
