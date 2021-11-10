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
      props.setUserAuth(auth.currentUser);
    } else {
      props.setUserAuth(null);
    }
  }
  onAuthStateChanged(getAuth(), authStateObserver);

  return (
    <div id="auth-container">
      {props.userAuth ? (
        <div>
          <p>Hi, {getFirstName(auth.currentUser.displayName)}!</p>
          <button onClick={logUserOut}>sign out</button>
        </div>
      ) : (
        <div>
          <button onClick={logUserIn}>sign in</button>
        </div>
      )}
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
