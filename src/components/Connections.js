import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

function Connections({ db, userData, userAuth, users, setUserData }) {
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
      alert(
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
      alert(`${requestedName} is already a pending or active connection!`);
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

  const toggleManageInvitations = (e) => {
    console.log(e.target);
    document.querySelectorAll(`.manage-connects-toggle`).forEach((toggle) => {
      toggle.classList.remove(`toggle-selected`);
    });
    e.target.classList.add(`toggle-selected`);

    document
      .querySelectorAll(`.pending-connects-container`)
      .forEach((container) => {
        container.style.display = `none`;
      });
    if (e.target.textContent === `Received`) {
      document.querySelector(`#received-connections`).style.display = `flex`;
    } else if (e.target.textContent === `Sent`) {
      document.querySelector(`#sent-connections`).style.display = `flex`;
    }
  };

  return (
    <div id="connections-container">
      {userAuth && !userAuth.isAnonymous ? (
        <div id="connections-user-container">
          <div className="connect-div" id="search-connections-container">
            <p>Connect with other adventurers!</p>
            <label htmlFor="search-connections"></label>
            <input
              type="text"
              id="search-connections"
              placeholder="search for connections..."
              onChange={searchUsers}
            />
            <div id="psuedo-relative">
              <ul id="matched-users-container" onClick={selectUser}></ul>
            </div>
            <button id="send-request-btn" onClick={handleConnectionRequest}>
              Send Request
            </button>
          </div>
          <div className="connect-div" id="active-connects-container">
            {connectionsObject.active.length ? (
              <h2 id="active-connects-header">
                {connectionsObject.active.length}
                {connectionsObject.active.length === 1
                  ? ` Connection`
                  : ` Connections`}
              </h2>
            ) : null}

            {connectionsObject.active.length
              ? connectionsObject.active.map((connect) => {
                  return (
                    <div key={`active-${connect.userId}`}>
                      <Link
                        className="connect-link"
                        state={{
                          userId: connect.userId,
                          userName: connect.userName,
                        }}
                        to={`../user/${connect.userId}`}
                      >
                        {connect.userName}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 64 64"
                          role="img"
                          className="inline-icons"
                        >
                          <path
                            className="link-icon"
                            data-name="layer2"
                            fill="none"
                            stroke="#202020"
                            strokeMiterlimit="10"
                            strokeWidth="2"
                            d="M30 62h32V2H2v32"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          ></path>
                          <path
                            className="link-icon"
                            data-name="layer1"
                            fill="none"
                            stroke="#202020"
                            strokeMiterlimit="10"
                            strokeWidth="2"
                            d="M26 56V38H8m18 0L2 62"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                      </Link>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="connect-div" id="manage-connects-container">
            <h2 id="manage-header">Manage Invitations</h2>
            <div className="toggle-header">
              <h3
                onClick={toggleManageInvitations}
                className="manage-connects-toggle toggle-selected"
              >
                Received
              </h3>
              ({connectionsObject.pendingReceived.length})
            </div>
            <div className="toggle-header">
              <h3
                onClick={toggleManageInvitations}
                className="manage-connects-toggle"
              >
                Sent
              </h3>
              ({connectionsObject.pendingSent.length})
            </div>
            <div
              className="pending-connects-container"
              id="received-connections"
            >
              {!connectionsObject.pendingReceived.length ? (
                <p className="none-pending">empty</p>
              ) : null}
              {connectionsObject.pendingReceived.map((connect) => {
                return (
                  <div
                    className="manage-connects"
                    data-userid={connect.userId}
                    data-username={connect.userName}
                    key={`received-${connect.userId}`}
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
            <div className="pending-connects-container" id="sent-connections">
              {!connectionsObject.pendingSent.length ? (
                <p className="none-pending">empty</p>
              ) : null}

              {connectionsObject.pendingSent.map((connect) => {
                return (
                  <div
                    key={`sent-${connect.userId}`}
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
        <div id="guest-container">
          <h1>Sign in with a Google account to...</h1>
          <ul id="guest-list">
            <li className="guest-list-items">
              <svg className="guest-icon" viewBox="0 0 64 64" role="img">
                <circle
                  data-name="layer2"
                  cx="32"
                  cy="39"
                  r="7"
                  fill="#FFEB3B"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></circle>
                <path
                  data-name="layer2"
                  d="M32 46a12.1 12.1 0 0 0-12 12v2h24v-2a12.1 12.1 0 0 0-12-12z"
                  fill="#dfdee3"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
                <circle
                  data-name="layer2"
                  cx="52"
                  cy="10"
                  r="6"
                  fill="#FFEB3B"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></circle>
                <path
                  data-name="layer2"
                  d="M62 28c0-7.5-4.5-12-10-12s-10 4.5-10 12z"
                  fill="#bdd5ae"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
                <circle
                  data-name="layer2"
                  cx="12"
                  cy="10"
                  r="6"
                  fill="#FFEB3B"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></circle>
                <path
                  data-name="layer2"
                  d="M22 28c0-7.5-4.5-12-10-12S2 20.5 2 28z"
                  fill="#a2bce0"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
                <path
                  data-name="layer1"
                  fill="none"
                  stroke="#202020"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M12 34l8 8m32-8l-8 8M24 14h16"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              Connect with other adventurers.
            </li>
            <li className="guest-list-items">
              <svg
                className="guest-icon"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
              >
                <path
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  stroke="#202020"
                  fill="#bdd5ae"
                  d="M32 22V10l28 20-28 20V38c-11.1 0-21.3.4-30 16 0-9.9 1-32 30-32z"
                  data-name="layer1"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Share private maps with connections.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Connections;
