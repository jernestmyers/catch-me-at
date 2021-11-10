import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getFirebaseConfig } from "../firebase-config";

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

export default function AuthenticateUser(props) {
  const auth = getAuth();

  //   if (auth.currentUser && props.userAuth !== auth) {
  //     props.setUserAuth(auth.currentUser);
  //   }

  const logUserIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const logUserOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const getFirstName = (fullName) => {
    return fullName.slice(0, fullName.indexOf(` `));
  };

  function authStateObserver(user) {
    if (user) {
      // User is signed in!
      // Get the signed-in user's profile pic and name.
      const userName = auth.currentUser.displayName;

      //   if (props.userAuth !== auth) {
      props.setUserAuth(auth.currentUser);
      //   }

      // Set the user's profile pic and name.
      document.querySelector(
        `#display-user-name`
      ).textContent = `Hi, ${getFirstName(userName)}!`;

      // Show user's profile and sign-out button.
      document.querySelector(`#display-user-name`).removeAttribute("hidden");
      document.querySelector(`#sign-out-btn`).removeAttribute("hidden");

      // Hide sign-in button.
      document.querySelector(`#sign-in-btn`).setAttribute("hidden", "true");
    } else {
      // User is signed out!
      // Hide user's profile and sign-out button.
      document
        .querySelector(`#display-user-name`)
        .setAttribute("hidden", "true");
      document.querySelector(`#sign-out-btn`).setAttribute("hidden", "true");

      // Show sign-in button.
      document.querySelector(`#sign-in-btn`).removeAttribute("hidden");
    }
  }
  onAuthStateChanged(getAuth(), authStateObserver);

  return (
    <div id="auth-container">
      {/* {props.isSignedIn ? (
        <div>
          <p>Hi, {getFirstName(auth.currentUser.displayName)}!</p>
          <button onClick={logUserOut}>sign out</button>
        </div>
      ) : (
        <div>
          <button onClick={logUserOut}>sign out</button>
          <button onClick={logUserIn}>sign in</button>
        </div>
      )} */}
      <div>
        <p id="display-user-name"></p>
        <button id="sign-in-btn" onClick={logUserIn}>
          sign in
        </button>
        <button id="sign-out-btn" onClick={logUserOut}>
          sign out
        </button>
      </div>
      <button
        onClick={() =>
          console.log({
            auth: auth.currentUser,
            user: props.userAuth,
          })
        }
      >
        click for auth
      </button>
    </div>
  );
}
