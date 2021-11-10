import React, { useState } from "react";
import CreateOrEditMap from "./components/CreateOrEditMap.js";
import RenderMaps from "./components/RenderMaps.js";
import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
// } from "firebase/auth";
import { getFirebaseConfig } from "./firebase-config.js";
import "./App.css";
import AuthenticateUser from "./components/AuthenticateUser.js";

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

function App() {
  console.log(`app mounts`);
  const [userAuth, setUserAuth] = useState();

  const [mapsSaved, setMapsSaved] = useState([
    {
      mapID: "123456",
      marker: [
        { lat: 0.032958, lng: 179.604 },
        { lat: 76.059, lng: 150.495 },
      ],
      info: [
        {
          id: "abcd",
          data: [
            { id: "place", value: "ocean" },
            { id: "date", value: "today" },
            { id: "time", value: "now" },
            { id: "what", value: "diving" },
          ],
        },
        {
          id: "efgh",
          data: [
            { id: "place", value: "somewhere" },
            { id: "date", value: "tomorrow" },
            { id: "time", value: "not now" },
            { id: "what", value: "no idea" },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>catch me at _______</h1>
        <AuthenticateUser
          userAuth={userAuth}
          setUserAuth={setUserAuth}
        ></AuthenticateUser>
      </header>
      <CreateOrEditMap
        mapsSaved={mapsSaved}
        setMapsSaved={setMapsSaved}
      ></CreateOrEditMap>
      {/* {mapsSaved.map((object, index) => {
        return <RenderMaps mapObject={object}></RenderMaps>;
      })} */}
      <button onClick={() => console.log(mapsSaved)}>see mapsSaved</button>
    </div>
  );
}

export default App;
