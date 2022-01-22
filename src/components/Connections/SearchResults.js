export default function SearchResults({ filteredUser, selectedUser }) {
  return (
    <li
      onClick={() => selectedUser(filteredUser[0], filteredUser[1])}
      className="matched-users"
    >
      {filteredUser[1]}
    </li>
  );
}
