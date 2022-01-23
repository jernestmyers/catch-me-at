import SearchResults from "./SearchResults";

export default function SearchResultsContainer({
  userSearchRequest,
  clickedUserId,
  users,
  userAuth,
  selectedUser,
}) {
  return (
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
                user[1].toLowerCase().includes(userSearchRequest.toLowerCase())
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
  );
}
