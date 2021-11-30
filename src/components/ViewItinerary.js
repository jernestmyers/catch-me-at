import React from "react";
import { createWhereElements } from "../functions/helperDOMMethods";
import { useLocation } from "react-router-dom";
import { format, compareAsc } from "date-fns";

const ViewItinerary = (props) => {
  console.log(props.markers);
  const currentPath = useLocation().pathname;

  const getDateObject = (dateObjectArray) => {
    const year = dateObjectArray[0].substring(0, 4);
    const month = +dateObjectArray[0].substring(5, 7);
    const day = dateObjectArray[0].substring(8, 10);
    const hour = dateObjectArray[1].substring(0, 2);
    const minute = dateObjectArray[1].substring(3, 5);
    return new Date(year, month - 1, day, hour, minute);
  };

  const sortedMarkersByDate = [...props.markers]
    .map((object) => {
      return getDateObject([
        object.userInputData[0].value,
        object.userInputData[1].value,
      ]);
    })
    .sort(compareAsc);

  console.log(sortedMarkersByDate);

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
            <div
              className="itinerary-header-container"
              id={currentPath === "/create" ? "itinerary-header-create" : null}
            >
              <div className="marker-header-container">
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
              </div>
              {currentPath === "/create" ? (
                <div className="modify-btns-container">
                  <button
                    data-hover="Edit item?"
                    className="modify-btns"
                    onClick={props.prepareToEditMarkerAndData}
                  >
                    <svg
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                    >
                      <path
                        d="M54.368 17.674l6.275-6.267-8.026-8.025-6.274 6.267"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        stroke="#202020"
                        fill="#FFAFAF"
                        data-name="layer2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M17.766 54.236l36.602-36.562-8.025-8.025L9.74 46.211 3.357 60.618l14.409-6.382zM9.74 46.211l8.026 8.025"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        stroke="#202020"
                        fill="#dfdee3"
                        data-name="layer1"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </button>
                  <button
                    data-hover="Delete item?"
                    className="modify-btns"
                    onClick={props.deleteMarkerAndData}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 64 64"
                      role="img"
                    >
                      <path
                        data-name="layer2"
                        fill="#dfdee3"
                        stroke="#202020"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        d="M6 10h52m-36 0V5.9A3.9 3.9 0 0 1 25.9 2h12.2A3.9 3.9 0 0 1 42 5.9V10m10.5 0l-2.9 47.1a5 5 0 0 1-4.9 4.9H19.3a5 5 0 0 1-4.9-4.9L11.5 10"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      ></path>
                      <path
                        data-name="layer1"
                        fill="none"
                        stroke="#202020"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        d="M32 18v36M22 18l2 36m18-36l-2 36"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
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
          </div>
        );
      })}
    </div>
  );
};

export default ViewItinerary;
