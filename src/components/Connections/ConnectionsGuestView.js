export default function ConnectionsGuestView() {
  return (
    <div id="guest-container">
      <h1>Sign in with a Google account to...</h1>
      <ul id="guest-list">
        <li className="guest-list-items">
          <svg className="guest-icon" viewBox="0 0 64 64" role="img">
            <circle
              data-name="layer2"
              cx="32"
              cy="39"
              r="7"
              fill="#FFEB3B"
              stroke="#202020"
              strokeMiterlimit="10"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></circle>
            <path
              data-name="layer2"
              d="M32 46a12.1 12.1 0 0 0-12 12v2h24v-2a12.1 12.1 0 0 0-12-12z"
              fill="#dfdee3"
              stroke="#202020"
              strokeMiterlimit="10"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
            <circle
              data-name="layer2"
              cx="52"
              cy="10"
              r="6"
              fill="#FFEB3B"
              stroke="#202020"
              strokeMiterlimit="10"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></circle>
            <path
              data-name="layer2"
              d="M62 28c0-7.5-4.5-12-10-12s-10 4.5-10 12z"
              fill="#bdd5ae"
              stroke="#202020"
              strokeMiterlimit="10"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
            <circle
              data-name="layer2"
              cx="12"
              cy="10"
              r="6"
              fill="#FFEB3B"
              stroke="#202020"
              strokeMiterlimit="10"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></circle>
            <path
              data-name="layer2"
              d="M22 28c0-7.5-4.5-12-10-12S2 20.5 2 28z"
              fill="#a2bce0"
              stroke="#202020"
              strokeMiterlimit="10"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
            <path
              data-name="layer1"
              fill="none"
              stroke="#202020"
              strokeMiterlimit="10"
              strokeWidth="2"
              d="M12 34l8 8m32-8l-8 8M24 14h16"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
          Connect with other adventurers.
        </li>
        <li className="guest-list-items">
          <svg
            className="guest-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <path
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              stroke="#202020"
              fill="#bdd5ae"
              d="M32 22V10l28 20-28 20V38c-11.1 0-21.3.4-30 16 0-9.9 1-32 30-32z"
              data-name="layer1"
              strokeLinejoin="round"
            ></path>
          </svg>
          Share private maps with connections.
        </li>
      </ul>
    </div>
  );
}
