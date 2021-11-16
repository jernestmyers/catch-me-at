import React from "react";
import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <nav>
      <ul>
        <li>
          <Link id="home-nav" to="/">
            home
          </Link>
        </li>
        <li>
          <Link id="about-nav" to="/create">
            create itinerary
          </Link>
        </li>
        <li>
          <Link id="shop-nav" to="/view">
            view itineraries
          </Link>
        </li>

        <li id="nav-cart">
          <Link id="nav-cart-link" to="/connect">
            connect
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
