import React from "react";
import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <nav>
      <ul>
        <li>
          <Link id="home-nav" to="/catch-me-at">
            home
          </Link>
        </li>
        <li>
          <Link id="about-nav" to="/catch-me-at/create">
            create itinerary
          </Link>
        </li>
        <li>
          <Link id="shop-nav" to="catch-me-at/view">
            view itineraries
          </Link>
        </li>

        <li id="nav-cart">
          <Link id="nav-cart-link" to="catch-me-at/connect">
            connections
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
