export default function ConnectionsSearchBar({
  searchUsers,
  userSearchRequest,
}) {
  return (
    <>
      <p>Connect with other adventurers!</p>
      <label htmlFor="search-connections"></label>
      <input
        type="text"
        id="search-connections"
        placeholder="search for connections..."
        onChange={searchUsers}
        value={userSearchRequest}
      />
    </>
  );
}
