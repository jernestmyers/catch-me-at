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
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ViewMapItinerary from "./components/ViewMapItinerary.js";
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
      // const fetchedPublicMaps = storeFetchAsArray(
      //   "publicMaps",
      //   fetchPublicMaps
      // );
      setPublicMaps(storeFetchAsArray("publicMaps", fetchPublicMaps));
      // console.log(fetchedPublicMaps);
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
      console.log(`userData - let's go!`);
      setIsUserDataSet(true);
      setMapsSaved(userData.mapsOwned);
    }
  }, [userData, setUserData]);

  const checkForUserData = async () => {
    try {
      let doesUserExist = null;
      const fetchUserIds = await getDocs(collection(db, "users"));
      const fetchedUserIds = storeFetchAsArray("users", fetchUserIds);
      // console.log(fetchedUserIds);
      fetchedUserIds.filter((id) => {
        if (id === userAuth.uid) {
          doesUserExist = true;
        }
      });
      // console.log(doesUserExist);
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

  const testArray = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ];

  const testArrayIDs = testArray
    .map((data) => {
      return data[0];
    })
    .includes(3);

  console.log(testArrayIDs);

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
            path="/"
            element={
              <Home
                userAuth={userAuth}
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
            element={<ViewMaps userData={userData}></ViewMaps>}
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
        <button onClick={() => console.log(mapsSaved)}>see mapsSaved</button>
        <button onClick={() => console.log(userData)}>see data fetch</button>
      </div>
    </Router>
  );
}

export default App;
