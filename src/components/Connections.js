import React, { useState, useEffect } from "react";
import {
  // collection,
  // getDocs,
  getDoc,
  // setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
// import { useResolvedPath } from "react-router";
// import { Link } from "react-router-dom";

function Connections({ db, userData, userAuth, users, setUserData }) {
  // console.log({ userData });

  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  const [userRequestedData, setUserRequestedData] = useState();
  const [updateTypeRequested, setUpdateTypeRequested] = useState();

  let connectionsObject;
  if (userAuth && !userAuth.isAnonymous) {
    connectionsObject = userData.connections;
  }

  useEffect(() => {
    if (isUpdateNeeded && userRequestedData) {
      updateFirestoreConnections(userRequestedData);
      setIsUpdateNeeded(false);
      setUpdateTypeRequested(null);
      setUserRequestedData(null);
    }
  }, [
    userRequestedData,
    setUserRequestedData,
    isUpdateNeeded,
    setIsUpdateNeeded,
    // updateTypeRequested,
    // setUpdateTypeRequested,
  ]);

  const searchUsers = (e) => {
    document.querySelector(`#send-request-btn`).style.display = `none`;
    const nameContainer = document.querySelector(`#matched-users-container`);
    nameContainer.style.display = `block`;
    nameContainer.innerHTML = ``;
    const string = e.target.value;
    users.forEach((user) => {
      if (
        string.length &&
        user[0] !== userAuth.uid &&
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
    const requestedId = e.target.dataset.userId;
    const requestedName = e.target.textContent;
    document.querySelector(`#search-connections`).value = e.target.textContent;
    document.querySelector(`#matched-users-container`).style.display = `none`;
    const sendRequestBtn = document.querySelector(`#send-request-btn`);
    sendRequestBtn.style.display = `block`;
    sendRequestBtn.setAttribute(`data-userid`, requestedId);
    sendRequestBtn.setAttribute(`data-username`, requestedName);
  };

  const handleConnectionRequest = (e) => {
    const requestedId = e.target.dataset.userid;
    const requestedName = e.target.dataset.username;
    setUpdateTypeRequested(`send`);
    setUserRequestedData({ id: requestedId, name: requestedName });
    const connectionsCombined = userData.connections.active.concat(
      userData.connections.pendingSent
    );
    const connectionsIds = connectionsCombined.map((connects) => {
      return connects.userId;
    });
    const pendingReceivedIds = userData.connections.pendingReceived.map(
      (received) => {
        return received.userId;
      }
    );
    if (pendingReceivedIds.includes(requestedId)) {
      console.log(
        `You have a pending request from ${requestedName}! Accept their request?`
      );
    } else if (!connectionsIds.includes(requestedId)) {
      const updatedPendingConnections = userData.connections.pendingSent.concat(
        {
          userId: requestedId,
          userName: requestedName,
        }
      );
      Object.assign(userData.connections, {
        pendingSent: updatedPendingConnections,
      });
      setUserData((prevState) => Object.assign(prevState, userData));
      document.querySelector(`#search-connections`).value = ``;
      setIsUpdateNeeded(true);
    } else {
      console.log(
        `${requestedName} is already a pending or active connection!`
      );
    }
  };

  const handleConnectionClickEvent = (e) => {
    const idOfSender = e.target.closest(`div`).dataset.userid;
    const nameOfSender = e.target.closest(`div`).dataset.username;
    const connectionType = e.target.dataset.connectiontype;
    setUserRequestedData({ id: idOfSender, name: nameOfSender });
    setUpdateTypeRequested(connectionType);
    updateUserConnectionData(connectionType, idOfSender, nameOfSender);
  };

  const updateUserConnectionData = (type, id, name) => {
    if (type === `accept`) {
      const updatedActiveConnectionsData = userData.connections.active.concat({
        userId: id,
        userName: name,
      });
      Object.assign(userData.connections, {
        active: updatedActiveConnectionsData,
      });
    }
    if (type === `deny` || type === `accept`) {
      const updatedRequestsReceivedData =
        userData.connections.pendingReceived.filter((connection) => {
          if (connection.userId !== id) {
            return connection;
          }
        });
      Object.assign(userData.connections, {
        pendingReceived: updatedRequestsReceivedData,
      });
    }
    if (type === `withdraw`) {
      const updatedRequestsSentData = userData.connections.pendingSent.filter(
        (connection) => {
          if (connection.userId !== id) {
            return connection;
          }
        }
      );
      Object.assign(userData.connections, {
        pendingSent: updatedRequestsSentData,
      });
    }
    setUserData((prevState) => Object.assign(prevState, userData));
    setIsUpdateNeeded(true);
  };

  const updateFirestoreConnections = async (data) => {
    const userRef = doc(db, "users", userAuth.uid);
    const connectionRef = doc(db, "users", data.id);
    await updateDoc(userRef, {
      connections: userData.connections,
    });
    const getConnectionData = await getDoc(connectionRef);
    const connectionData = getConnectionData.data();
    if (updateTypeRequested === `send`) {
      const updatedPendingReceivedData =
        connectionData.connections.pendingReceived.concat({
          userId: userAuth.uid,
          userName: userAuth.displayName,
        });
      Object.assign(connectionData.connections, {
        pendingReceived: updatedPendingReceivedData,
      });
    }
    if (updateTypeRequested === `accept` || updateTypeRequested === `deny`) {
      const updatedRequestsSentData =
        connectionData.connections.pendingSent.filter((connection) => {
          if (connection.userId !== userAuth.uid) {
            return connection;
          }
        });
      if (updateTypeRequested === `accept`) {
        const updatedActiveConnectionsData =
          connectionData.connections.active.concat({
            userId: userAuth.uid,
            userName: userAuth.displayName,
          });
        Object.assign(connectionData.connections, {
          active: updatedActiveConnectionsData,
        });
      }
      Object.assign(connectionData.connections, {
        pendingSent: updatedRequestsSentData,
      });
    }
    if (updateTypeRequested === `withdraw`) {
      const updatedRequestsReceivedData =
        connectionData.connections.pendingReceived.filter((connection) => {
          if (connection.userId !== userAuth.uid) {
            return connection;
          }
        });
      Object.assign(connectionData.connections, {
        pendingReceived: updatedRequestsReceivedData,
      });
    }
    await updateDoc(connectionRef, { connections: connectionData.connections });
  };

  return (
    <div>
      {userAuth && !userAuth.isAnonymous ? (
        <div id="connections-container">
          <div id="active-connects-container">
            <h2 id="active-connects-header">Your Connections</h2>
            {connectionsObject.active.length
              ? connectionsObject.active.map((connect) => {
                  return <p>{connect.userName}</p>;
                })
              : null}
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
              <button id="send-request-btn" onClick={handleConnectionRequest}>
                Send Request
              </button>
            </div>
          </div>
          <div id="manage-connects-container">
            <h2 id="manage-header">Manage Invitations</h2>
            <div className="pending-connects-container">
              <h3>Received</h3>
              {connectionsObject.pendingReceived.map((connect) => {
                return (
                  <div
                    className="manage-connects"
                    data-userid={connect.userId}
                    data-username={connect.userName}
                  >
                    <p>{connect.userName}</p>
                    <button
                      data-connectiontype={`accept`}
                      onClick={handleConnectionClickEvent}
                    >
                      Accept
                    </button>
                    <button
                      data-connectiontype={`deny`}
                      onClick={handleConnectionClickEvent}
                    >
                      Deny
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="pending-connects-container">
              <h3>Sent</h3>
              {connectionsObject.pendingSent.map((connect) => {
                return (
                  <div
                    className="manage-connects"
                    data-userid={connect.userId}
                    data-username={connect.userName}
                  >
                    <p>{connect.userName}</p>
                    <button
                      data-connectiontype={`withdraw`}
                      onClick={handleConnectionClickEvent}
                    >
                      Withdraw
                    </button>
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
