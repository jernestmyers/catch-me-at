import ConnectionsSearchBar from "./ConnectionsSearchBar";
import SearchResultsContainer from "./SearchResultsContainer";

export default function ConnectionsSearchContainer({
  searchUsers,
  userSearchRequest,
  clickedUserId,
  users,
  userAuth,
  selectedUser,
  handleNewConnectionRequest,
}) {
  return (
    <div className="connect-div" id="search-connections-container">
      <ConnectionsSearchBar
        searchUsers={searchUsers}
        userSearchRequest={userSearchRequest}
      ></ConnectionsSearchBar>
      <SearchResultsContainer
        userSearchRequest={userSearchRequest}
        clickedUserId={clickedUserId}
        users={users}
        userAuth={userAuth}
        selectedUser={selectedUser}
      ></SearchResultsContainer>
      {clickedUserId
        ? users
            .filter((user) => user[0] === clickedUserId)
            .map((user) => (
              <button
                key={user[0]}
                id="send-request-btn"
                onClick={() => handleNewConnectionRequest(user[0], user[1])}
              >
                Send Request
              </button>
            ))
        : null}
    </div>
  );
}
