export default function ManageRequests({
  connectionsObject,
  handleConnectionClickEvent,
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
        <div className="pending-connects-container" id="received-connections">
          {!connectionsObject.pendingReceived.length ? (
            <p className="none-pending">empty</p>
          ) : null}
          {connectionsObject.pendingReceived.map((connect) => {
            return (
              <div
                className="manage-connects"
                key={`received-${connect.userId}`}
              >
                <p>{connect.userName}</p>
                <button
                  onClick={() =>
                    handleConnectionClickEvent(
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
                    handleConnectionClickEvent(
                      connect.userId,
                      connect.userName,
                      "deny"
                    )
                  }
                >
                  Deny
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pending-connects-container" id="sent-connections">
          {!connectionsObject.pendingSent.length ? (
            <p className="none-pending">empty</p>
          ) : null}

          {connectionsObject.pendingSent.map((connect) => {
            return (
              <div key={`sent-${connect.userId}`} className="manage-connects">
                <p>{connect.userName}</p>
                <button
                  onClick={() =>
                    handleConnectionClickEvent(
                      connect.userId,
                      connect.userName,
                      "withdraw"
                    )
                  }
                >
                  Withdraw
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
