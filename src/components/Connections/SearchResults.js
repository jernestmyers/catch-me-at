export default function SearchResults({ filteredUser, selectUser }) {
  return (
    <li
      onClick={() => selectUser(filteredUser[0], filteredUser[1])}
      className="matched-users"
    >
      {filteredUser[1]}
    </li>
  );
}
