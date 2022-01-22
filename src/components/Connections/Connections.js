import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import SearchResults from "./SearchResults";
import ConnectionsSearchBar from "./ConnectionsSearchBar";
import ActiveConnections from "./ActiveConnections";
import ManageRequests from "./ManageRequests";
import ConnectionsGuestView from "./ConnectionsGuestView";

function Connections({ db, userData, userAuth, users, setUserData }) {
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  const [userRequestedData, setUserRequestedData] = useState();
  const [updateTypeRequested, setUpdateTypeRequested] = useState();
  const [userSearchRequest, setUserSearchRequest] = useState("");
  const [clickedUserId, setClickedUserId] = useState(null);
  const [showReceivedRequests, setShowReceivedRequests] = useState(true);

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
    setClickedUserId(null);
    setUserSearchRequest(e.target.value);
  };

  const selectedUser = (requestedId, requestedName) => {
    setClickedUserId(requestedId);
    setUserSearchRequest(requestedName);
  };

  const handleConnectionRequest = (requestedId, requestedName) => {
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
      setUserSearchRequest("");
      setClickedUserId(null);
      setShowReceivedRequests(false);
      setIsUpdateNeeded(true);
    } else {
      alert(`${requestedName} is already a pending or active connection!`);
    }
  };

  const handleConnectionClickEvent = (
    idOfSender,
    nameOfSender,
    connectionType
  ) => {
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
        userData.connections.pendingReceived.filter(
          (connection) => connection.userId !== id
        );
      Object.assign(userData.connections, {
        pendingReceived: updatedRequestsReceivedData,
      });
    }
    if (type === `withdraw`) {
      const updatedRequestsSentData = userData.connections.pendingSent.filter(
        (connection) => connection.userId !== id
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
        connectionData.connections.pendingSent.filter(
          (connection) => connection.userId !== userAuth.uid
        );
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
        connectionData.connections.pendingReceived.filter(
          (connection) => connection.userId !== userAuth.uid
        );
      Object.assign(connectionData.connections, {
        pendingReceived: updatedRequestsReceivedData,
      });
    }
    await updateDoc(connectionRef, { connections: connectionData.connections });
  };

  return (
    <div id="connections-container">
      {userAuth && !userAuth.isAnonymous ? (
        <div id="connections-user-container">
          <div className="connect-div" id="search-connections-container">
            <ConnectionsSearchBar
              searchUsers={searchUsers}
              userSearchRequest={userSearchRequest}
            ></ConnectionsSearchBar>
            <div id="psuedo-relative">
              {clickedUserId ? null : (
                <ul id="matched-users-container">
                  {users
                    .filter(
                      (user) =>
                        userSearchRequest.length &&
                        user[0] !== userAuth.uid &&
                        user[1][0].toLowerCase() ===
                          userSearchRequest[0].toLowerCase() &&
                        user[1]
                          .toLowerCase()
                          .includes(userSearchRequest.toLowerCase())
                    )
                    .map((user) => (
                      <SearchResults
                        key={user[0]}
                        filteredUser={user}
                        selectedUser={selectedUser}
                      ></SearchResults>
                    ))}
                </ul>
              )}
            </div>
            {clickedUserId
              ? users
                  .filter((user) => user[0] === clickedUserId)
                  .map((user) => (
                    <button
                      key={user[0]}
                      id="send-request-btn"
                      onClick={() => handleConnectionRequest(user[0], user[1])}
                    >
                      Send Request
                    </button>
                  ))
              : null}
          </div>
          <ActiveConnections
            connectionsObject={connectionsObject}
          ></ActiveConnections>
          <ManageRequests
            connectionsObject={connectionsObject}
            handleConnectionClickEvent={handleConnectionClickEvent}
            showReceivedRequests={showReceivedRequests}
            setShowReceivedRequests={setShowReceivedRequests}
          ></ManageRequests>
        </div>
      ) : (
        <ConnectionsGuestView></ConnectionsGuestView>
      )}
    </div>
  );
}

export default Connections;
