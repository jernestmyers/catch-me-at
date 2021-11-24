import React from "react";
// import { useResolvedPath } from "react-router";
// import { Link } from "react-router-dom";

function Connections(props) {
  console.log(props);

  let connectionsObject;
  if (props.userAuth && !props.userAuth.isAnonymous) {
    connectionsObject = props.userData.connections;
  }

  const searchUsers = (e) => {
    document.querySelector(`#send-request-btn`).style.display = `none`;
    const nameContainer = document.querySelector(`#matched-users-container`);
    nameContainer.style.display = `block`;
    nameContainer.innerHTML = ``;
    const string = e.target.value;
    props.users.forEach((user) => {
      if (
        string.length &&
        user[1][0].toLowerCase() === string[0].toLowerCase() &&
        user[1].toLowerCase().includes(string.toLowerCase())
      ) {
        const li = document.createElement(`li`);
        li.classList.add(`matched-users`);
        li.textContent = user[1];
        li.dataset.userId = user[0];
        nameContainer.appendChild(li);
      }
    });
  };

  const selectUser = (e) => {
    console.log(e.target.dataset.userId);
    console.log(e.target.textContent);
    document.querySelector(`#search-connections`).value = e.target.textContent;
    document.querySelector(`#matched-users-container`).style.display = `none`;
    document.querySelector(`#send-request-btn`).style.display = `block`;
  };

  return (
    <div>
      {props.userAuth && !props.userAuth.isAnonymous ? (
        <div id="connections-container">
          <div id="active-connects-container">
            <h2 id="active-connects-header">Your Connections</h2>
            {connectionsObject.active.length ? (
              connectionsObject.active.map((connect) => {
                return <p>{connect.name}</p>;
              })
            ) : (
              <div id="search-connections-container">
                <p>New around here? Connect with other adventurers!</p>
                <label htmlFor="search-connections"></label>
                <input
                  type="text"
                  id="search-connections"
                  placeholder="search for connections..."
                  onChange={searchUsers}
                />
                <ul id="matched-users-container" onClick={selectUser}></ul>
                <button id="send-request-btn">Send Request</button>
              </div>
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
        </div>
      ) : (
        <div>
          <h1>
            Sign in with a Google account to connect with other adventurers!
          </h1>
        </div>
      )}
    </div>
  );
}

export default Connections;
