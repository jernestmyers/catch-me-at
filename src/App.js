import React, { useState, useEffect } from "react";
import AuthenticateUser from "./components/AuthenticateUser.js";
import NavBar from "./components/NavBar.js";
import Home from "./components/Home.js";
import ViewMaps from "./components/ViewMaps.js";
import CreateOrEditMap from "./components/CreateOrEditMap.js";
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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ViewMapItinerary from "./components/ViewMapItinerary.js";
// import uniqid from "uniqid";

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);
const db = getFirestore();

const newUserObject = {
  mapsOwned: [],
  connections: {
    active: [],
    pendingReceived: [],
    pendingSent: [],
  },
  mapsSharedWithUser: [],
  publicMapsSaved: [],
  likesByUser: [],
  commentsByUser: [],
};

function App() {
  const [userAuth, setUserAuth] = useState();
  const [userData, setUserData] = useState(null);
  const [mapsSaved, setMapsSaved] = useState([]);
  const [publicMaps, setPublicMaps] = useState([]);
  const [isUserDataSet, setIsUserDataSet] = useState();

  useEffect(() => {
    getPublicMaps();
  }, []);

  const getPublicMaps = async () => {
    try {
      const fetchPublicMaps = await getDocs(collection(db, "publicMaps"));
      setPublicMaps(storeFetchAsArray("publicMaps", fetchPublicMaps));
    } catch (error) {
      alert(
        `Hmm, we're experiencing the following error: "${error}." Try again later.`
      );
    }
  };

  useEffect(() => {
    if (userAuth) {
      if (!userAuth.isAnonymous) {
        getOrSetUserData();
      }
    }
  }, [userAuth, setUserAuth]);

  useEffect(() => {
    if (userData && !isUserDataSet) {
      // console.log(`userData - let's go!`);
      setIsUserDataSet(true);
      setMapsSaved(userData.mapsOwned);
    }
  }, [userData, setUserData]);

  const checkForUserData = async () => {
    try {
      let doesUserExist = null;
      const fetchUserIds = await getDocs(collection(db, "users"));
      const fetchedUserIds = storeFetchAsArray("users", fetchUserIds);
      fetchedUserIds.filter((id) => {
        if (id === userAuth.uid) {
          doesUserExist = true;
        }
      });
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
        const fetchUserData = await getDoc(doc(db, "users", userAuth.uid));
        setUserData(fetchUserData.data());
      } else {
        setDoc(doc(db, "users", userAuth.uid), newUserObject);
      }
    } catch (error) {
      alert(
        `Hmm, we're experiencing the following error: "${error}." Try again later.`
      );
    }
  };

  const storeFetchAsArray = (collection, data) => {
    const dataHelper = [];
    if (collection === `users`) {
      data.forEach((doc) => {
        dataHelper.push(doc.id);
      });
    } else if (collection === `publicMaps`) {
      data.forEach((doc) => {
        dataHelper.push([doc.id, doc.data()]);
      });
    }
    return dataHelper;
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div id="title-container">
            <svg
              id="app-logo"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
            >
              <path
                strokeWidth="2"
                strokeMiterlimit="10"
                stroke="black"
                fill="#A2BCE0"
                d="M53.9 28.4A26 26 0 1 1 41 13m-2.1-1c-5.8 2.8-9.9 3.1-9.9 6.7s5.2 1.5 5.2 5.2-4 6.3-6.9 4.4-6.9-3-10.4 1.8-1.2 10.4 1.3 10.3 4.8-2.4 5.9.6 1.3 3 2.4 3.6 1.2 1.9.8 3.6 1.8 6.9 3.5 6.9 3.3-.7 3.5-3.5 2.3-2.9 3.3-3.7-.7-3.7 1.1-5.6 5.7-5.4 2.5-6.3-3-1.5-3.5-2.9-1.8-2.8.9-2.9a10.3 10.3 0 0 0 7.4-3.1l.7-.7"
                data-name="layer2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <path
                strokeWidth="2"
                strokeMiterlimit="10"
                stroke="#202020"
                fill="red"
                d="M51 2a10 10 0 0 0-10 10c0 9 10 20 10 20s10-11 10-20A10 10 0 0 0 51 2z"
                data-name="layer1"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <circle
                strokeWidth="2"
                strokeMiterlimit="10"
                stroke="#202020"
                fill="none"
                r="2"
                cy="12"
                cx="51"
                data-name="layer1"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></circle>
            </svg>
            <h1 id="app-title">catch me at</h1>
          </div>
          <AuthenticateUser
            db={db}
            userAuth={userAuth}
            setUserAuth={setUserAuth}
          ></AuthenticateUser>
          <NavBar></NavBar>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                userAuth={userAuth}
                // setUserAuth={setUserAuth}
                // setUserData={setUserData}
                mapsSaved={mapsSaved}
                publicMaps={publicMaps}
              ></Home>
            }
          ></Route>
          <Route
            path="/create"
            element={
              <CreateOrEditMap
                db={db}
                userAuth={userAuth}
                userData={userData}
                setUserData={setUserData}
                mapsSaved={mapsSaved}
                setMapsSaved={setMapsSaved}
                publicMaps={publicMaps}
              ></CreateOrEditMap>
            }
          ></Route>
          <Route
            path="/view"
            element={
              <ViewMaps userAuth={userAuth} userData={userData}></ViewMaps>
            }
          ></Route>
          <Route
            path="/view/*"
            element={
              <ViewMapItinerary
                userAuth={userAuth}
                userData={userData}
                publicMaps={publicMaps}
              ></ViewMapItinerary>
            }
          ></Route>
          <Route
            path="/connect"
            element={<Connections userData={userData}></Connections>}
          ></Route>
        </Routes>
        {/* <button onClick={() => console.log(mapsSaved)}>see mapsSaved</button> */}
        <button onClick={() => console.log({ userData, publicMaps })}>
          see data fetch
        </button>
      </div>
    </Router>
  );
}

export default App;
