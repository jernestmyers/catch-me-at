import React from "react";
import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <nav>
      <ul>
        <li>
          <Link className="nav-link" to="/">
            home
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/create">
            create itinerary
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/view">
            view itineraries
          </Link>
        </li>

        <li>
          <Link className="nav-link" to="/connect">
            connect
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
