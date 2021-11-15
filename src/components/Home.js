import React from "react";
// import { Link } from "react-router-dom";

function Home(props) {
  return (
    <div id="home-container">
      <h1>HOME</h1>
      {props.userAuth ? (
        <h1>This is Home when logged in, even as a guest.</h1>
      ) : (
        <h1>This is Home when NOT logged in.</h1>
      )}
    </div>
  );
}

export default Home;
