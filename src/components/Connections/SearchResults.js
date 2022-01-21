export default function SearchResults({ filteredUser }) {
  return (
    <li
      key={filteredUser[0]}
      className="matched-users"
      data-userid={filteredUser[0]}
    >
      {filteredUser[1]}
    </li>
  );
}
