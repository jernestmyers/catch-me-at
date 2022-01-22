export default function ManageRequests({
  connectionsObject,
  toggleManageInvitations,
  handleConnectionClickEvent,
}) {
  return (
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
      <div className="pending-connects-container" id="received-connections">
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
  );
}
