import React, { useState, useEffect } from "react";
import AuthenticateUser from "./components/AuthenticateUser.js";
import NavBar from "./components/NavBar.js";
import Home from "./components/Home.js";
import CreateOrEditMap from "./components/CreateOrEditMap.js";
import RenderMaps from "./components/RenderMaps.js";
import ViewItinerary from "./components/ViewItinerary.js";
import Connections from "./components/Connections.js";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "./firebase-config.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
// import uniqid from "uniqid";

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);
const db = getFirestore();

const newUserObject = {
  mapsOwned: [],
  connections: [],
  mapsSharedWithUser: [],
  publicMapsSaved: [],
  likesByUser: [],
  commentsByUser: [],
};

function App() {
  const [userAuth, setUserAuth] = useState();
  const [userData, setUserData] = useState();
  const [mapsSaved, setMapsSaved] = useState([]);
  const [mapClicked, setMapClicked] = useState([]);
  const [isUserDataSet, setIsUserDataSet] = useState();

  useEffect(() => {
    if (userAuth) {
      if (!userAuth.isAnonymous) {
        getOrSetUserData();
      }
    }
  }, [userAuth, setUserAuth]);

  useEffect(() => {
    if (userData && !isUserDataSet) {
      console.log(`userData - let's go!`);
      setIsUserDataSet(true);
      setMapsSaved(userData.mapsOwned);
    }
  }, [userData, setUserData]);

  const checkForUserData = async () => {
    try {
      let doesUserExist = null;
      const fetchUserIds = await getDocs(collection(db, "users"));
      const fetchedUserIds = storeFetchAsArray(fetchUserIds);
      fetchedUserIds.filter((id) => {
        if (id === userAuth.uid) {
          doesUserExist = true;
        }
      });
      console.log(doesUserExist);
      return doesUserExist;
    } catch (error) {
      alert(
        `Hmm, we're experiencing the following error: "${error}." Try again later.`
      );
    }
  };

  const getOrSetUserData = async () => {
    try {
      const doesUserExist = await checkForUserData();
      if (doesUserExist) {
        console.log(`get user's data!`);
        const fetchUserData = await getDoc(doc(db, "users", userAuth.uid));
        setUserData(fetchUserData.data());
      } else {
        console.log(`create new user!`);
        setDoc(doc(db, "users", userAuth.uid), newUserObject);
      }
    } catch (error) {
      alert(
        `Hmm, we're experiencing the following error: "${error}." Try again later.`
      );
    }
  };

  const storeFetchAsArray = (users) => {
    const dataHelper = [];
    users.forEach((doc) => {
      dataHelper.push(doc.id);
    });
    return dataHelper;
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>catch me at</h1>
          <AuthenticateUser
            db={db}
            userAuth={userAuth}
            setUserAuth={setUserAuth}
          ></AuthenticateUser>
          <NavBar></NavBar>
        </header>
        <Routes>
          <Route
            path="/catch-me-at"
            exact
            element={<Home userAuth={userAuth}></Home>}
          ></Route>

          <Route
            path="/catch-me-at/create"
            element={
              <CreateOrEditMap
                db={db}
                userAuth={userAuth}
                userData={userData}
                setUserData={setUserData}
                mapsSaved={mapsSaved}
                setMapsSaved={setMapsSaved}
              ></CreateOrEditMap>
            }
          ></Route>
          <Route
            path="/catch-me-at/view"
            element={mapsSaved.map((object) => {
              return (
                // <Link to={`/catch-me-at/view/${object.id}`}>
                <div>
                  <RenderMaps key={object.id} mapObject={object}></RenderMaps>
                  <ViewItinerary markers={object.markers}></ViewItinerary>
                </div>
                // </Link>
              );
            })}
          ></Route>
          {/* <Route
            path={`/catch-me-at/view/${mapClicked.id}`}
            element={mapClicked.map((object) => {
              return (
                <div>
                  <RenderMaps key={object.id} mapObject={object}></RenderMaps>
                  <ViewItinerary markers={object.markers}></ViewItinerary>
                </div>
              );
            })}
          ></Route> */}
          <Route
            path="/catch-me-at/connect"
            exact
            element={<Connections userData={userData}></Connections>}
          ></Route>
        </Routes>
        {/* <CreateOrEditMap
          db={db}
          userAuth={userAuth}
          userData={userData}
          setUserData={setUserData}
          mapsSaved={mapsSaved}
          setMapsSaved={setMapsSaved}
        ></CreateOrEditMap>
        {mapsSaved.map((object) => {
          return <RenderMaps key={object.id} mapObject={object}></RenderMaps>;
        })} */}
        {/* <button onClick={() => console.log(mapsSaved)}>see mapsSaved</button> */}
        {/* <button onClick={() => console.log(userData)}>see data fetch</button> */}
      </div>
    </Router>
  );
}

export default App;
