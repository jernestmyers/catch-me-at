import React, { useState, useEffect } from "react";
// import CreateOrEditMap from "./components/CreateOrEditMap.js";
// import RenderMaps from "./components/RenderMaps.js";
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
import "./App.css";
import AuthenticateUser from "./components/AuthenticateUser.js";

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);
const db = getFirestore();

function App() {
  const [userAuth, setUserAuth] = useState();
  const [userData, setUserData] = useState();
  const [mapsSaved, setMapsSaved] = useState([]);

  useEffect(() => {
    if (userAuth) {
      if (!userAuth.isAnonymous) {
        getOrSetUserData();
      }
    }
  }, [userAuth, setUserAuth]);

  const checkForUserData = async () => {
    try {
      let userExists;
      const fetchUserIds = await getDocs(collection(db, "users"));
      const fetchedUserIds = storeFetchAsArray(fetchUserIds);
      fetchedUserIds.filter((id) => {
        if (id === userAuth.uid) {
          userExists = true;
        }
      });
      return userExists;
    } catch (error) {
      alert(
        `Hmm, we're experiencing the following error: "${error}." Try again later.`
      );
    }
  };

  const getOrSetUserData = async () => {
    try {
      if (checkForUserData()) {
        console.log(`get user's data!`);
        const fetchUserData = await getDoc(doc(db, "users", userAuth.uid));
        setUserData(fetchUserData.data());
      } else {
        console.log(`create new user!`);
        setDoc(doc(db, "users", userAuth.uid), {});
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
    <div className="App">
      <header className="App-header">
        <h1>catch me at _______</h1>
        <AuthenticateUser
          db={db}
          userAuth={userAuth}
          setUserAuth={setUserAuth}
        ></AuthenticateUser>
      </header>
      {/* <CreateOrEditMap
        userAuth={userAuth}
        mapsSaved={mapsSaved}
        setMapsSaved={setMapsSaved}
      ></CreateOrEditMap> */}
      {/* {mapsSaved.map((object, index) => {
        return <RenderMaps mapObject={object}></RenderMaps>;
      })} */}
      <button onClick={() => console.log(mapsSaved)}>see mapsSaved</button>
      <button onClick={() => console.log(userData)}>see data fetch</button>
    </div>
  );
}

export default App;
