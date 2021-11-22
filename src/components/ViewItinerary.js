import React from "react";
import { createWhereElements } from "../functions/helperDOMMethods";
import { useLocation } from "react-router-dom";
import { format, parseJSON } from "date-fns";

const ViewItinerary = (props) => {
  // console.log(props);
  const currentPath = useLocation().pathname;

  const sortedMarkers = [...props.markers];
  sortedMarkers.sort((a, b) => {
    return a.order - b.order;
  });

  const formatDateAndTime = (dateObjectArray) => {
    const year = dateObjectArray[0].substring(0, 4);
    const month = +dateObjectArray[0].substring(5, 7);
    const day = dateObjectArray[0].substring(8, 10);
    const hour = dateObjectArray[1].substring(0, 2);
    const minute = dateObjectArray[1].substring(3, 5);
    const formattedDate = format(new Date(year, month - 1, day), "MMM d, yyyy");
    const formattedTime = format(
      new Date(year, month - 1, day, hour, minute),
      "h:mmaaa"
    );
    return [formattedDate, formattedTime];
  };

  return (
    <div id="itinerary-container">
      {sortedMarkers.map((object) => {
        const whereElements = createWhereElements(object.place);
        return (
          <div className="itinerary-item" key={object.id} data-id={object.id}>
            <h1 className="marker-header-number">{object.order}</h1>
            <svg
              className="marker-details-header"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
            >
              <path
                d="M38.1 46H52l8 16H4l8-16h13.9"
                strokeWidth="2"
                strokeMiterlimit="10"
                stroke="#202020"
                fill="#A2BCE0"
                data-name="layer2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
              <path
                strokeWidth="2"
                strokeMiterlimit="10"
                stroke="#202020"
                fill="red"
                d="M32 2a18.1 18.1 0 0 0-18.1 18.1C13.9 36.4 32 52.4 32 52.4s18.1-16 18.1-32.3A18.1 18.1 0 0 0 32 2z"
                data-name="layer1"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
            <h2 className="itin-section-header">Where</h2>
            <div id="view-where">
              <p className="itin-where-text">{whereElements[0].innerText}</p>
              <p>{whereElements[1].innerText}</p>
              <a
                className="view-google-link"
                href={whereElements[2].href}
                target="_blank"
                rel="noreferrer"
              >
                {whereElements[2].innerText}
              </a>
            </div>
            <h2 className="itin-section-header">When</h2>
            <div>
              <p>
                {
                  formatDateAndTime([
                    object.userInputData[0].value,
                    object.userInputData[1].value,
                  ])[0]
                }{" "}
                @{" "}
                {
                  formatDateAndTime([
                    object.userInputData[0].value,
                    object.userInputData[1].value,
                  ])[1]
                }
              </p>
            </div>
            <h2 className="itin-section-header">What</h2>
            <div>
              <p>{object.userInputData[2].value}</p>
            </div>
            {currentPath === "/create" ? (
              <div>
                <button
                  className="modify-btns"
                  onClick={props.prepareToEditMarkerAndData}
                >
                  edit
                </button>
                <button
                  className="modify-btns"
                  onClick={props.deleteMarkerAndData}
                >
                  delete
                </button>
              </div>
            ) : props.userAuth.uid === props.mapObject.owner.ownerId ? (
              <div>
                <button
                  className="modify-btns"
                  onClick={props.prepareToEditMarkerAndData}
                >
                  edit
                </button>
                <button
                  className="modify-btns"
                  onClick={props.deleteMarkerAndData}
                >
                  delete
                </button>
              </div>
            ) : null}
            {/* <button onClick={props.prepareToEditMarkerAndData}>edit</button>
            <button onClick={props.deleteMarkerAndData}>delete</button> */}
          </div>
        );
      })}
    </div>
  );
};

export default ViewItinerary;
