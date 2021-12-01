import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import RenderMaps from "./RenderMaps";
import ViewItinerary from "./ViewItinerary";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";

function ViewMapItinerary(props) {
  console.log(props.userData);
  const navigate = useNavigate();
  const mapID = useParams()["*"];
  const publicMapsArray = props.publicMaps
    .map((array) => {
      return array[1];
    })
    .map((object) => {
      return object.mapObject;
    });
  const mapsSharedArray = props.mapsSharedWithUser
    .map((array) => {
      return array[1];
    })
    .map((object) => {
      return object.mapObject;
    });

  let mapToDisplay;
  if (props.userAuth && !props.userAuth.isAnonymous) {
    const mapsCombinedArray = [
      ...props.userData.mapsOwned,
      ...publicMapsArray,
      ...mapsSharedArray,
    ];
    // Passing in mapToDisplay[0] prevents duplicate rendering
    mapToDisplay = mapsCombinedArray.filter((map) => {
      if (mapID === map.mapID) {
        return map;
      }
    });
  } else {
    mapToDisplay = [...publicMapsArray];
  }

  const openDeleteMapModal = () => {
    const confirmDeleteModal = document.querySelector(
      `#confirm-delete-psuedo-relative`
    );
    confirmDeleteModal.style.display = `block`;
  };

  const closeDeleteModal = () => {
    const confirmDeleteModal = document.querySelector(
      `#confirm-delete-psuedo-relative`
    );
    confirmDeleteModal.style.display = `none`;
  };

  const handleDeleteMap = (e) => {
    closeDeleteModal();
    const updatedMapsOwned = props.userData.mapsOwned.filter((map) => {
      if (map.mapID !== mapToDisplay[0].mapID) {
        return map;
      }
    });
    updateFirestore(mapToDisplay[0], updatedMapsOwned);
    props.setUserData((prevState) => {
      return { ...prevState, mapsOwned: updatedMapsOwned };
    });
    navigate(`../view`);
  };

  const updateFirestore = async (mapToDelete, userMapsUpdated) => {
    const userRef = doc(props.db, "users", props.userAuth.uid);
    await updateDoc(userRef, {
      mapsOwned: JSON.parse(JSON.stringify(userMapsUpdated)),
    });

    if (!mapToDelete.isPrivate) {
      const docRef = doc(props.db, "publicMaps", mapToDelete.mapID);
      await deleteDoc(docRef);
      props.setPublicMaps(
        props.publicMaps.filter((map) => {
          if (map[0] !== mapToDelete.mapID) {
            return map;
          }
        })
      );
    }
  };

  return (
    <div id="detailed-view-container">
      {mapToDisplay.length &&
      props.userData &&
      mapToDisplay[0].owner.ownerId === props.userAuth.uid ? (
        <div className="modify-btns-container modify-map-container">
          <button
            data-hover="Edit map?"
            className="modify-btns modify-map"
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
            data-hover="Delete map?"
            className="modify-btns modify-map"
            onClick={openDeleteMapModal}
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
          <div id="confirm-delete-psuedo-relative">
            <div id="confirm-delete-map-container">
              <p>
                Are you sure you wish to delete this itinerary and all of its
                contents?
              </p>
              <div id="confirm-delete-btns-container">
                <button onClick={handleDeleteMap}>Yes, Delete</button>
                <button onClick={closeDeleteModal}>No, Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <RenderMaps
        db={props.db}
        userAuth={props.userAuth}
        mapObject={mapToDisplay[0]}
        publicMaps={props.publicMaps}
        setPublicMaps={props.setPublicMaps}
        userData={props.userData}
        setUserData={props.setUserData}
        mapsSavedByUser={props.mapsSavedByUser}
        setMapsSavedByUser={props.setMapsSavedByUser}
        mapsSharedWithUser={props.mapsSharedWithUser}
        setMapsSharedWithUser={props.setMapsSharedWithUser}
      ></RenderMaps>
      <ViewItinerary
        mapObject={mapToDisplay[0]}
        markers={mapToDisplay[0].markers}
        userAuth={props.userAuth}
      ></ViewItinerary>
    </div>
  );
}

export default ViewMapItinerary;
