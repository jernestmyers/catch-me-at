import React from "react";
// import { Link } from "react-router-dom";

function Connections(props) {
  console.log(props.userData);
  const connectionsObject = props.userData.connections;
  return (
    <div id="connections-container">
      <div id="active-connects-container">
        <h2 id="active-connects-header">Your Connections</h2>
        {connectionsObject.active.length ? (
          connectionsObject.active.map((connect) => {
            return <p>{connect.name}</p>;
          })
        ) : (
          <p>looking lonely- connect with other adventurers!</p>
        )}
      </div>
      <div id="manage-connects-container">
        <h2 id="manage-header">Manage Invitations</h2>
        <div className="pending-connects-container">
          <h3>Received</h3>
          {connectionsObject.pendingReceived.map((connect) => {
            return (
              <div className="manage-connects">
                <p>{connect.name}</p>
                <button>Approve</button>
                <button>Deny</button>
              </div>
            );
          })}
        </div>
        <div className="pending-connects-container">
          <h3>Sent</h3>
          {connectionsObject.pendingSent.map((connect) => {
            return (
              <div className="manage-connects">
                <p>{connect.name}</p>
                <button>Withdraw</button>
              </div>
            );
          })}
        </div>
      </div>
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
