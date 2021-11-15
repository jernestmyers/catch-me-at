import React from "react";
// import { Link } from "react-router-dom";

function Connections(props) {
  console.log(props.userData);
  return (
    <div id="connections-container">
      <h1>connections</h1>
      <h2>your active connections:</h2>
      <h2>your pending requests:</h2>
      <h2>your sent requests:</h2>
      <div id="search-connections-container">
        <label htmlFor="search-connections"></label>
        <input
          type="text"
          id="search-connections"
          placeholder="search for connections..."
        />
      </div>
    </div>
  );
}

export default Connections;
