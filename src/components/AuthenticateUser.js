import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getFirebaseConfig } from "../firebase-config";

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

export default function AuthenticateUser() {
  const auth = getAuth();

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

  return (
    <div id="auth-container">
      {auth.currentUser ? (
        <div>
          <p>Hi, {getFirstName(auth.currentUser.displayName)}!</p>
          <button onClick={logUserOut}>sign out</button>
        </div>
      ) : (
        <button onClick={logUserIn}>sign in</button>
      )}
      <button onClick={() => console.log(auth.currentUser)}>
        click for auth
      </button>
    </div>
  );
}
