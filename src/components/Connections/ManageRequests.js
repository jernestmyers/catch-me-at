export default function ManageRequests({
  connectionsObject,
  handlePendingConnectionRequest,
  showReceivedRequests,
  setShowReceivedRequests,
}) {
  return (
    <div className="connect-div" id="manage-connects-container">
      <h2 id="manage-header">Manage Invitations</h2>
      <div className="toggle-header">
        <h3
          onClick={() => setShowReceivedRequests(true)}
          className={`manage-connects-toggle ${
            showReceivedRequests ? "toggle-selected" : null
          }`}
        >
          Received
        </h3>
        ({connectionsObject.pendingReceived.length})
      </div>
      <div className="toggle-header">
        <h3
          onClick={() => setShowReceivedRequests(false)}
          className={`manage-connects-toggle ${
            !showReceivedRequests ? "toggle-selected" : null
          }`}
        >
          Sent
        </h3>
        ({connectionsObject.pendingSent.length})
      </div>
      {showReceivedRequests ? (
        <ul className="pending-connects-container" id="received-connections">
          {!connectionsObject.pendingReceived.length ? (
            <li>
              <p className="none-pending">empty</p>
            </li>
          ) : null}
          {connectionsObject.pendingReceived.map((connect) => {
            return (
              <li
                className="manage-connects"
                key={`received-${connect.userId}`}
              >
                <p>{connect.userName}</p>
                <button
                  onClick={() =>
                    handlePendingConnectionRequest(
                      connect.userId,
                      connect.userName,
                      "accept"
                    )
                  }
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    handlePendingConnectionRequest(
                      connect.userId,
                      connect.userName,
                      "deny"
                    )
                  }
                >
                  Deny
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="pending-connects-container" id="sent-connections">
          {!connectionsObject.pendingSent.length ? (
            <li>
              <p className="none-pending">empty</p>
            </li>
          ) : null}

          {connectionsObject.pendingSent.map((connect) => {
            return (
              <li key={`sent-${connect.userId}`} className="manage-connects">
                <p>{connect.userName}</p>
                <button
                  onClick={() =>
                    handlePendingConnectionRequest(
                      connect.userId,
                      connect.userName,
                      "withdraw"
                    )
                  }
                >
                  Withdraw
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
