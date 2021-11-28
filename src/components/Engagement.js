import { format, parseJSON } from "date-fns";
import React, { useState, useEffect } from "react";
import {
  // collection,
  // getDocs,
  getDoc,
  // setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function Engagement({
  db,
  mapObject,
  userAuth,
  publicMaps,
  userData,
  setPublicMaps,
  setUserData,
  mapsSavedByUser,
  setMapsSavedByUser,
}) {
  const [comment, setComment] = useState({});
  const [targetMapId, setTargetMapId] = useState(null);
  const [likeStatus, setLikeStatus] = useState();
  const [likesCounter, setLikesCounter] = useState();
  const [isShareContainerOpen, setIsShareContainerOpen] = useState(false);
  const [shareContainerId, setShareContainerId] = useState(null);

  if (userAuth && (!userAuth.uid || userAuth.isAnonymous)) {
    const btns = document.querySelectorAll(`.engage-icon-container`);
    btns.forEach((btn) => {
      btn.classList.add(`disabled`);
    });
  }

  useEffect(() => {
    setLikesCounter(mapObject.likes);
  }, []);

  // function closeShareContainer(e) {
  //   console.log(e.target);
  //   if (
  //     isShareContainerOpen &&
  //     e.target.closest(`div`).id !== `share-selector-${shareContainerId}`
  //   ) {
  //     document
  //       .querySelectorAll(`.share-with-container`)
  //       .forEach((container) => {
  //         container.style.display = `none`;
  //       });
  //     setIsShareContainerOpen(false);
  //     setShareContainerId(null);
  //   }
  // }

  // useEffect(() => {
  //   if (isShareContainerOpen && shareContainerId) {
  //     // console.log(`addEventListener`);
  //     // document.addEventListener(`click`, closeShareContainer);
  //   }
  //   if (!isShareContainerOpen && !shareContainerId) {
  //     // console.log(`removeEventListener`);
  //     // document.removeEventListener(`click`, closeShareContainer);
  //   }
  // }, [
  //   isShareContainerOpen,
  //   setIsShareContainerOpen,
  //   shareContainerId,
  //   setShareContainerId,
  // ]);

  useEffect(() => {
    if (comment && targetMapId) {
      console.log(`useEffect`);
      const updatedCommentObject = {
        comments: [...mapObject.comments, comment],
      };
      Object.assign(mapObject, updatedCommentObject);
      sendCommentToFirestore(targetMapId);
      document.querySelector(`#user-comment-${targetMapId}`).value = ``;
      setComment(null);
      setTargetMapId(null);
    }
  }, [comment, setComment]);

  useEffect(() => {
    if (likeStatus && targetMapId) {
      console.log(`like useEffect`);
      let updatedLikesByUser;
      if (userData.likesByUser.includes(targetMapId)) {
        updatedLikesByUser = userData.likesByUser.filter((item) => {
          if (item !== targetMapId) {
            return item;
          }
        });
      } else {
        updatedLikesByUser = userData.likesByUser.concat(targetMapId);
      }
      setUserData((prevState) =>
        Object.assign(prevState, { likesByUser: updatedLikesByUser })
      );
      sendLikeToFirestore(likeStatus, targetMapId, updatedLikesByUser);
      setLikeStatus(null);
      setTargetMapId(null);
    }
  }, [likeStatus, setLikeStatus]);

  const handleAddComment = (e) => {
    if (userAuth.uid && !userAuth.isAnonymous) {
      const mapID = e.target.closest(`div`).dataset.mapid;
      document.querySelector(`#comment-box-${mapID}`).style.display === "block"
        ? (document.querySelector(
            `#comment-box-${mapID}`
          ).style.display = `none`)
        : (document.querySelector(
            `#comment-box-${mapID}`
          ).style.display = `block`);
    }
  };

  const handleUserComment = (e) => {
    const getPostCommentBtns = document.querySelectorAll("button[data-mapid]");
    const matchedBtn = [];
    getPostCommentBtns.forEach((btn) => {
      if (e.target.id === `user-comment-${btn.dataset.mapid}`) {
        matchedBtn.push(btn);
      }
    });
    if (e.target.value) {
      matchedBtn[0].style.display = `block`;
    } else {
      matchedBtn[0].style.display = ``;
    }
  };

  const submitComment = (e) => {
    const commentTextarea = document.querySelector(
      `#user-comment-${e.target.dataset.mapid}`
    );
    setTargetMapId(e.target.dataset.mapid);

    if (commentTextarea.value) {
      setComment({
        userId: userAuth.uid,
        name: userAuth.displayName,
        date: JSON.stringify(new Date()),
        comment: commentTextarea.value,
      });
    }
  };

  const showDate = (dateObject) => {
    return format(dateObject, "MMM d, yyyy, h:mmaaa");
  };

  const sendCommentToFirestore = async (id) => {
    if (!mapObject.isPrivate) {
      console.log(`update publicMap`);
      const docRef = doc(db, "publicMaps", id);
      await updateDoc(docRef, { mapObject });
      setPublicMaps((prevState) =>
        prevState.map((map) => {
          if (id === map[0]) {
            return [map[0], { mapObject }];
          } else {
            return map;
          }
        })
      );
    }
    if (userAuth.uid === mapObject.owner.ownerId) {
      console.log(`user owns map, update it.`);
      const userRef = doc(db, "users", userAuth.uid);
      const userObject = await getDoc(userRef);
      const maps = userObject.data().mapsOwned;
      maps.filter((map) => {
        if (id === map.mapID) {
          Object.assign(map, mapObject);
        }
      });
      await updateDoc(userRef, {
        mapsOwned: JSON.parse(JSON.stringify(maps)),
      });
      setUserData((prevState) => Object.assign(prevState, { mapsOwned: maps }));
    }
    if (mapObject.isPrivate && userAuth.uid === mapObject.owner.ownerId) {
      console.log(
        `map isPrivate AND not the user's, so map is shared with user`
      );
    }
  };

  const handleLike = (e) => {
    if (userAuth.uid && !userAuth.isAnonymous) {
      const iconId = e.target.closest(`div`).dataset.mapid;
      if (userData.likesByUser.includes(iconId)) {
        setLikeStatus(`unliked`);
      } else {
        setLikeStatus(`liked`);
      }
      setTargetMapId(iconId);
    }
  };

  const sendLikeToFirestore = async (status, id, userLikes) => {
    const userRef = doc(db, "users", userAuth.uid);

    await updateDoc(userRef, {
      likesByUser: userLikes,
    });

    if (status === `liked`) {
      Object.assign(mapObject, {
        likes: mapObject.likes + 1,
      });
      setLikesCounter((prevState) => prevState + 1);
    } else {
      Object.assign(mapObject, {
        likes: mapObject.likes - 1,
      });
      setLikesCounter((prevState) => prevState - 1);
    }

    if (!mapObject.isPrivate) {
      console.log(`update publicMap`);
      const docRef = doc(db, "publicMaps", id);
      await updateDoc(docRef, {
        mapObject: JSON.parse(JSON.stringify(mapObject)),
      });
    }

    if (userAuth.uid === mapObject.owner.ownerId) {
      console.log(`user owns map, update it.`);
      const userRef = doc(db, "users", userAuth.uid);
      const userObject = await getDoc(userRef);
      const maps = userObject.data().mapsOwned;
      maps.filter((map) => {
        if (id === map.mapID) {
          Object.assign(map, mapObject);
        }
      });
      await updateDoc(userRef, {
        mapsOwned: JSON.parse(JSON.stringify(maps)),
      });
      setUserData((prevState) => Object.assign(prevState, { mapsOwned: maps }));
    }

    if (mapObject.isPrivate && userAuth.uid === mapObject.owner.ownerId) {
      console.log(
        `map isPrivate AND not the user's, so map is shared with user`
      );
    }
  };

  const handleSavePublicMap = async (e) => {
    if (
      userAuth.uid &&
      !userAuth.isAnonymous &&
      userAuth.uid !== mapObject.owner.ownerId
    ) {
      const mapSavedData = {
        ownerId: mapObject.owner.ownerId,
        mapID: mapObject.mapID,
      };
      const userRef = doc(db, "users", userAuth.uid);

      if (isMapSaved().includes(mapObject.mapID)) {
        console.log(`unsave`);
        const savedMapsUpdater = userData.publicMapsSaved.filter((data) => {
          if (data.mapID !== mapObject.mapID) {
            return data;
          }
        });
        setMapsSavedByUser(
          mapsSavedByUser.filter((data) => {
            if (data[0] !== mapObject.mapID) {
              return data;
            }
          })
        );
        setUserData((prevState) =>
          Object.assign(prevState, {
            publicMapsSaved: savedMapsUpdater,
          })
        );
        await updateDoc(userRef, {
          publicMapsSaved: savedMapsUpdater,
        });
      } else {
        console.log(`save`);
        setMapsSavedByUser([
          ...mapsSavedByUser,
          [mapObject.mapID, { mapObject: mapObject }],
        ]);
        const savedMapsUpdater = [...userData.publicMapsSaved, mapSavedData];
        setUserData((prevState) =>
          Object.assign(prevState, {
            publicMapsSaved: savedMapsUpdater,
          })
        );
        await updateDoc(userRef, {
          publicMapsSaved: savedMapsUpdater,
        });
      }
    }
  };

  const handleShareMap = (e) => {
    if (
      userAuth.uid &&
      !userAuth.isAnonymous &&
      mapObject.owner.ownerId === userAuth.uid
    ) {
      if (!isShareContainerOpen) {
        const mapToShareId = e.target.closest(`div`).dataset.mapid;
        setIsShareContainerOpen(true);
        setShareContainerId(mapToShareId);
        const shareWithContainer = document.querySelector(
          `#share-with-${mapToShareId}`
        );
        shareWithContainer.style.display = `block`;
        shareWithContainer.style.left = `${e.pageX - 50}px`;
        shareWithContainer.style.top = `${e.pageY}px`;

        const div = document.createElement(`div`);
        div.classList.add(`close-share-container`);

        const p = document.createElement(`p`);
        p.textContent = `Share with...`;
        const span = document.createElement(`span`);
        span.textContent = `X`;
        span.title = `close`;
        span.classList.add(`close-share`);

        div.appendChild(p);
        div.appendChild(span);

        shareWithContainer.appendChild(div);

        userData.connections.active.forEach((connect) => {
          const option = document.createElement(`p`);
          option.textContent = connect.userName;
          option.setAttribute(`data-username`, connect.userName);
          option.setAttribute(`data-userid`, connect.userId);
          option.classList.add(`share-connection-name`);
          shareWithContainer.appendChild(option);
        });
      }
    }
  };

  const handleShareSelection = (e) => {
    if (e.target.title === `close`) {
      setIsShareContainerOpen(false);
      const containerToClose = e.target.closest(`div`).parentElement;
      containerToClose.style.display = `none`;
      while (containerToClose.firstChild) {
        containerToClose.removeChild(containerToClose.firstChild);
      }
    }
    if (e.target.dataset.userid) {
      console.log(e.target.dataset.username);
    }
  };

  const isMapSaved = () => {
    return userData.publicMapsSaved.map((data) => data.mapID);
  };

  return (
    <div id="engagement-container">
      <div className="display-engagement-data">
        <div id={`likes-number-${mapObject.mapID}`} className="numberOfLikes">
          {likesCounter ? likesCounter : null}
        </div>
        <div
          className={
            userAuth.uid && !userAuth.isAnonymous
              ? "numberOfComments"
              : "numberOfComments disabled"
          }
          data-mapid={mapObject.mapID}
          onClick={handleAddComment}
        >
          {mapObject.comments.length ? (
            <p className="comment-quantity-text">
              {mapObject.comments.length}
              {mapObject.comments.length === 1 ? ` comment` : ` comments`}
            </p>
          ) : (
            <p className="comment-quantity-text">Be the first to comment!</p>
          )}
        </div>
      </div>
      <div className="engage-btns-bar">
        <div
          onClick={handleLike}
          data-mapid={mapObject.mapID}
          className="engage-icon-container like-btn"
        >
          <svg
            className="engage-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            role="img"
          >
            <path
              className={
                (userData && !userData.likesByUser.includes(mapObject.mapID)) ||
                !userAuth.uid ||
                userAuth.isAnonymous
                  ? null
                  : `liked`
              }
              data-name="layer1"
              id={`like-icon-${mapObject.mapID}`}
              d="M54 35h2a4 4 0 1 0 0-8H34a81 81 0 0 0 2-18 4 4 0 0 0-8 0s-4 22-18 22H4v24h10c4 0 12 4 16 4h20a4 4 0 0 0 0-8h2a4 4 0 0 0 0-8h2a4 4 0 0 0 0-8"
              fill="none"
              stroke="#202020"
              strokeMiterlimit="10"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
          {(userData && !userData.likesByUser.includes(mapObject.mapID)) ||
          !userAuth.uid ||
          userAuth.isAnonymous ? (
            <p className="btn-text" id={`like-text-${mapObject.mapID}`}>
              Like
            </p>
          ) : (
            <p
              className="engaged-text btn-text"
              id={`like-text-${mapObject.mapID}`}
            >
              Liked
            </p>
          )}
        </div>
        <div
          className="engage-icon-container comment-btn"
          data-mapid={mapObject.mapID}
          onClick={handleAddComment}
        >
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
          <p className="btn-text">Comment</p>
        </div>
        <div
          data-hover="Must be map owner to share."
          data-mapid={mapObject.mapID}
          className={
            userData && mapObject.owner.ownerId !== userAuth.uid
              ? `engage-icon-container disabled disable-share`
              : `engage-icon-container`
          }
          onClick={handleShareMap}
        >
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
          <p className="btn-text">Share</p>
        </div>
        <div
          className="share-with-container"
          id={`share-with-${mapObject.mapID}`}
          onClick={handleShareSelection}
        >
          {/* <span
            className="close-share"
            title="close"
            onClick={closeShareSelector}
          >
            x
          </span>
          <p>Share with...</p> */}
        </div>
        <div
          data-hover="You own this map."
          className={
            userData && mapObject.owner.ownerId === userAuth.uid
              ? `engage-icon-container disable-save`
              : `engage-icon-container`
          }
          onClick={handleSavePublicMap}
        >
          <svg
            className="engage-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            role="img"
          >
            <path
              data-name="layer2"
              fill={
                userData &&
                (isMapSaved().includes(mapObject.mapID) ||
                  userAuth.uid === mapObject.owner.ownerId)
                  ? "#a2bce0"
                  : "none"
              }
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
              fill={
                userData &&
                (isMapSaved().includes(mapObject.mapID) ||
                  userAuth.uid === mapObject.owner.ownerId)
                  ? "#bdd5ae"
                  : "none"
              }
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
          {userData &&
          (isMapSaved().includes(mapObject.mapID) ||
            userAuth.uid === mapObject.owner.ownerId) ? (
            <p className="engaged-text btn-text">Saved</p>
          ) : (
            <p className="save-text btn-text">Save</p>
          )}
        </div>
      </div>
      <div className="comments-container" id={`comment-box-${mapObject.mapID}`}>
        {mapObject.comments.map((commentObject) => {
          return (
            <div className="comment">
              <p className="comment-name">{commentObject.name}</p>
              <p className="comment-date">
                {showDate(parseJSON(commentObject.date))}
              </p>
              <p className="comment-text">{commentObject.comment}</p>
            </div>
          );
        })}
        <div className="comment userComment">
          <p className="comment-name">{userAuth.displayName}</p>
          <p className="comment-date">{showDate(new Date())}</p>
          <div className="comment-text userComment-text">
            <textarea
              className="userComment-textarea"
              id={`user-comment-${mapObject.mapID}`}
              placeholder="Add a comment..."
              onChange={handleUserComment}
            ></textarea>
            <button
              className="post-comment-btn"
              data-mapid={mapObject.mapID}
              onClick={submitComment}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() =>
          console.log({ userData, userAuth, mapObject, mapsSavedByUser })
        }
      >
        Check State
      </button>
    </div>
  );
}

export default Engagement;
