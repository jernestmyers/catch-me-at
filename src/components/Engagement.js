import React from "react";

function Engagement(props) {
  // console.log(props);

  return (
    <div id="engage-container">
      <div className="engage-icon-container">
        <svg
          className="engage-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          role="img"
        >
          <path
            data-name="layer1"
            d="M54 35h2a4 4 0 1 0 0-8H34a81 81 0 0 0 2-18 4 4 0 0 0-8 0s-4 22-18 22H4v24h10c4 0 12 4 16 4h20a4 4 0 0 0 0-8h2a4 4 0 0 0 0-8h2a4 4 0 0 0 0-8"
            fill="none"
            stroke="#202020"
            strokeMiterlimit="10"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
        <p>Like</p>
      </div>
      <div className="engage-icon-container">
        <svg
          className="engage-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          role="img"
        >
          <path
            data-name="layer2"
            fill="none"
            stroke="#202020"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M56 32V9H2v36h14v9.9L26.8 45H32"
          ></path>
          <path
            data-name="layer1"
            fill="none"
            stroke="#202020"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M47 37v14m7-7H40"
          ></path>
          <circle
            data-name="layer1"
            cx="47"
            cy="44"
            r="15"
            fill="none"
            stroke="#202020"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          ></circle>
        </svg>
        <p>Comment</p>
      </div>
      <div className="engage-icon-container">
        <svg
          className="engage-icon"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <path
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            stroke="#202020"
            fill="none"
            d="M32 22V10l28 20-28 20V38c-11.1 0-21.3.4-30 16 0-9.9 1-32 30-32z"
            data-name="layer1"
            strokeLinejoin="round"
          ></path>
        </svg>
        <p>Share</p>
      </div>
      <div className="engage-icon-container">
        <svg
          className="engage-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          role="img"
        >
          <path
            data-name="layer2"
            fill="none"
            stroke="#202020"
            strokeMiterlimit="10"
            strokeWidth="2"
            d="M31.2 52H2V2h43.3L52 8.7v22.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
          <path
            data-name="layer2"
            fill="none"
            stroke="#202020"
            strokeMiterlimit="10"
            strokeWidth="2"
            d="M44 30.1V28H10v24m24-42v4m8-12v16.3a1.7 1.7 0 0 1-1.7 1.7H23.7a1.7 1.7 0 0 1-1.7-1.7V2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
          <circle
            data-name="layer1"
            cx="46"
            cy="46"
            r="16"
            fill="none"
            stroke="#202020"
            strokeMiterlimit="10"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></circle>
          <path
            data-name="layer1"
            fill="none"
            stroke="#202020"
            strokeMiterlimit="10"
            strokeWidth="2"
            d="M46 38v16m-8-8h16"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
        <p>Save</p>
      </div>
    </div>
  );
}

export default Engagement;
