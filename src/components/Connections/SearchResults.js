export default function SearchResults({ filteredUser }) {
  return (
    <li className="matched-users" data-userid={filteredUser[0]}>
      {filteredUser[1]}
    </li>
  );
}
