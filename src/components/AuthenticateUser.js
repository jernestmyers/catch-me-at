import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getFirebaseConfig } from "../firebase-config";
import { Link } from "react-router-dom";

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

export default function AuthenticateUser(props) {
  const auth = getAuth();

  const logUserIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const logInAsGuest = () => {
    signInAnonymously(auth);
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
      props.setUserAuth(auth.currentUser);
    } else {
      props.setUserAuth(null);
    }
  }
  onAuthStateChanged(getAuth(), authStateObserver);

  return (
    <div id="auth-container">
      {props.userAuth ? (
        <div id="sign-in-container">
          {props.userAuth.displayName ? (
            <p id="user-greeting">
              Hi, {getFirstName(auth.currentUser.displayName)}!
            </p>
          ) : (
            <p id="user-greeting">Welcome, Guest!</p>
          )}
          <Link to={`/`}>
            <button onClick={logUserOut}>sign out</button>
          </Link>
        </div>
      ) : (
        <div>
          <div id="prompt-sign-in-container">
            <button onClick={logUserIn}>sign in with google</button>
            <span>&nbsp;or&nbsp;</span>
            <button onClick={logInAsGuest}>sign in as guest</button>
          </div>
          <div id="drop-down-sign-in-container">
            <h4
              id="drop-down-header"
              onClick={() => {
                if (
                  document.querySelector(`#drop-down-sign-in`).style.display !==
                  `flex`
                ) {
                  document.querySelector(
                    `#drop-down-sign-in`
                  ).style.display = `flex`;
                } else {
                  document.querySelector(
                    `#drop-down-sign-in`
                  ).style.display = ``;
                }
              }}
            >
              log in / sign up
            </h4>
            <div id="drop-down-sign-in">
              <button onClick={logUserIn}>sign in with google</button>
              <span>&nbsp;or&nbsp;</span>
              <button onClick={logInAsGuest}>sign in as guest</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
