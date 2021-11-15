import React, { useState, useEffect } from "react";
import CreateOrEditMap from "./components/CreateOrEditMap.js";
// import RenderMaps from "./components/RenderMaps.js";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "./firebase-config.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./App.css";
import AuthenticateUser from "./components/AuthenticateUser.js";

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

  useEffect(() => {
    if (userAuth) {
      if (!userAuth.isAnonymous) {
        getOrSetUserData();
      }
    }
  }, [userAuth, setUserAuth]);

  const checkForUserData = async () => {
    try {
      let doesUserExist = null;
      const fetchUserIds = await getDocs(collection(db, "users"));
      const fetchedUserIds = storeFetchAsArray(fetchUserIds);
      console.log(fetchedUserIds);
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

  const testArray = [
    {
      ownerId: "0RkquKMMUkdwM5s92OpMjMBW2Ix1",
      mapID: "kw05zb46",
      markers: [
        {
          id: "kw05z767",
          coordinates: {
            lat: 39.9525839,
            lng: -75.1652215,
          },
          place: {
            address_components: [
              {
                long_name: "Philadelphia",
                short_name: "Philadelphia",
                types: ["locality", "political"],
              },
              {
                long_name: "Philadelphia County",
                short_name: "Philadelphia County",
                types: ["administrative_area_level_2", "political"],
              },
              {
                long_name: "Pennsylvania",
                short_name: "PA",
                types: ["administrative_area_level_1", "political"],
              },
              {
                long_name: "United States",
                short_name: "US",
                types: ["country", "political"],
              },
            ],
            formatted_address: "Philadelphia, PA, USA",
            geometry: {
              location: {},
              viewport: {
                Ab: {
                  g: 39.86700406742303,
                  h: 40.13799186419682,
                },
                Ra: {
                  g: -75.28029371735357,
                  h: -74.95576291304663,
                },
              },
            },
            name: "Philadelphia",
            place_id: "ChIJ60u11Ni3xokRwVg-jNgU9Yk",
            types: ["locality", "political"],
            url: "https://maps.google.com/?q=Philadelphia,+PA,+USA&ftid=0x89c6b7d8d4b54beb:0x89f514d88c3e58c1",
            html_attributions: [],
          },
          userInputData: [
            {
              id: "date",
              value: "",
            },
            {
              id: "time",
              value: "",
            },
            {
              id: "what",
              value: "",
            },
          ],
        },
      ],
      isPublished: false,
      isPrivate: false,
      likes: null,
      comments: [],
    },
  ];

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
      <CreateOrEditMap
        db={db}
        userAuth={userAuth}
        userData={userData}
        setUserData={setUserData}
        mapsSaved={mapsSaved}
        setMapsSaved={setMapsSaved}
      ></CreateOrEditMap>
      {/* {mapsSaved.map((object, index) => {
        return <RenderMaps mapObject={object}></RenderMaps>;
      })} */}
      <button onClick={() => console.log(mapsSaved)}>see mapsSaved</button>
      <button onClick={() => console.log(userData)}>see data fetch</button>
      <button
        onClick={async () => {
          const userRef = doc(db, "users", userAuth.uid);
          await updateDoc(userRef, { mapsOwned: [...testArray] });
        }}
      >
        {" "}
        test firestore
      </button>
    </div>
  );
}

export default App;
