import { format, parseJSON } from "date-fns";
import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";

const checkmark = `
<svg class="shared-with-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
  <path data-name="layer1"
  d="M28 48L14.879 34.12a3 3 0 0 1 4.242-4.242L28 39l18.83-20.072a3 3 0 1 1 4.34 4.143z"
  fill="#6a994e" stroke="#6a994e" stroke-miterlimit="10" stroke-width="5" stroke-linejoin="round"
  stroke-linecap="round"></path>
</svg>`;

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
  mapsSharedWithUser,
  setMapsSharedWithUser,
}) {
  const [comment, setComment] = useState({});
  const [targetMapId, setTargetMapId] = useState(null);
  const [likeStatus, setLikeStatus] = useState();
  const [likesCounter, setLikesCounter] = useState();
  const [isShareContainerOpen, setIsShareContainerOpen] = useState(false);
  const [connectionToShareWith, setConnectionToShareWith] = useState(null);

  if (userAuth && (!userAuth.uid || userAuth.isAnonymous)) {
    const btns = document.querySelectorAll(`.engage-icon-container`);
    btns.forEach((btn) => {
      btn.classList.add(`disabled`);
    });
  }

  useEffect(() => {
    setLikesCounter(mapObject.likes);
  }, []);

  useEffect(() => {
    if (connectionToShareWith) {
      updateSharedWithData();
    }
  }, [connectionToShareWith, setConnectionToShareWith]);

  useEffect(() => {
    if (comment && targetMapId) {
      // console.log(`comment useEffect`);
      const updatedCommentObject = {
        comments: [...mapObject.comments, comment],
      };
      Object.assign(mapObject, updatedCommentObject);
      sendCommentToFirestore(targetMapId);
      document.querySelector(`#user-comment-${targetMapId}`).value = ``;
      setComment(null);
      setTargetMapId(null);
    }
  }, [targetMapId, setTargetMapId, comment, setComment]);

  useEffect(() => {
    if (likeStatus && targetMapId) {
      // console.log(`like useEffect`);
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
      console.log(`update publicMap comments`);
      const docRef = doc(db, "publicMaps", id);
      await updateDoc(docRef, {
        mapObject: JSON.parse(JSON.stringify(mapObject)),
      });
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
      // console.log(`user owns map, update comments.`);
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
    if (userAuth.uid !== mapObject.owner.ownerId) {
      if (isMapSharedWith().includes(mapObject.mapID)) {
        // console.log(
        //   `update mapsSharedWithUser comments state on the front end`
        // );
        setMapsSharedWithUser((prevState) =>
          prevState.map((map) => {
            if (id === map[0]) {
              return [map[0], { mapObject }];
            } else {
              return map;
            }
          })
        );
      }
      if (isMapSaved().includes(mapObject.mapID)) {
        // updated mapsSavedByUser comment state on the front end
        setMapsSavedByUser((prevState) =>
          prevState.map((map) => {
            if (id === map[0]) {
              return [map[0], { mapObject }];
            } else {
              return map;
            }
          })
        );
      }
      // console.log(`update owner's map comments data on Firestore`);
      const userRef = doc(db, "users", mapObject.owner.ownerId);
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
    }
  };

  const handleLike = (e) => {
    if (userAuth.uid && !userAuth.isAnonymous) {
      const iconId = e.target.closest(`div`).dataset.mapid;
      setTargetMapId(iconId);
      if (userData.likesByUser.includes(iconId)) {
        setLikeStatus(`unliked`);
      } else {
        setLikeStatus(`liked`);
      }
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
      // console.log(`update publicMap likes`);
      const docRef = doc(db, "publicMaps", id);
      await updateDoc(docRef, {
        mapObject: JSON.parse(JSON.stringify(mapObject)),
      });
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
      // console.log(`user owns map, update likes.`);
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

    if (userAuth.uid !== mapObject.owner.ownerId) {
      // update publicMapsSaved likes state on front end
      if (isMapSaved().includes(mapObject.mapID)) {
        setMapsSavedByUser((prevState) =>
          prevState.map((map) => {
            if (id === map[0]) {
              return [map[0], { mapObject }];
            } else {
              return map;
            }
          })
        );
      }

      if (isMapSharedWith().includes(mapObject.mapID)) {
        // console.log(`update mapsSharedWithUser likes state on the front end`);
        setMapsSharedWithUser((prevState) =>
          prevState.map((map) => {
            if (id === map[0]) {
              return [map[0], { mapObject }];
            } else {
              return map;
            }
          })
        );
      }
      // console.log(`update owner's map likes data on Firestore`);
      const userRef = doc(db, "users", mapObject.owner.ownerId);
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
    }
  };

  const handleSavePublicMap = async (e) => {
    if (
      userAuth.uid &&
      !userAuth.isAnonymous &&
      userAuth.uid !== mapObject.owner.ownerId &&
      !isMapSharedWith().includes(mapObject.mapID)
    ) {
      const mapSavedData = {
        ownerId: mapObject.owner.ownerId,
        mapID: mapObject.mapID,
      };
      const userRef = doc(db, "users", userAuth.uid);

      if (isMapSaved().includes(mapObject.mapID)) {
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
        const shareWithContainer = document.querySelector(
          `#share-with-${mapToShareId}`
        );
        shareWithContainer.style.display = `block`;
        shareWithContainer.style.left = `${e.pageX - 75}px`;
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

        const arrayOfIdsSharedWith = mapObject.sharedWith.map((user) => {
          return user.userId;
        });

        userData.connections.active.forEach((connect) => {
          if (!arrayOfIdsSharedWith.includes(connect.userId)) {
            const option = document.createElement(`p`);
            option.textContent = connect.userName;
            option.setAttribute(`data-username`, connect.userName);
            option.setAttribute(`data-userid`, connect.userId);
            option.classList.add(`share-connection-name`);
            shareWithContainer.appendChild(option);
          } else {
            const span = document.createElement(`p`);
            span.innerHTML = checkmark;
            const option = document.createElement(`span`);
            option.textContent = connect.userName;
            option.classList.add(`shared-with-connection-name`);
            span.appendChild(option);
            shareWithContainer.appendChild(span);
          }
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
      setIsShareContainerOpen(false);
      setConnectionToShareWith({
        userId: e.target.dataset.userid,
        userName: e.target.dataset.username,
      });
      const containerToClose = e.target.closest(`div`);
      containerToClose.style.display = `none`;
      while (containerToClose.firstChild) {
        containerToClose.removeChild(containerToClose.firstChild);
      }
    }
  };

  const updateSharedWithData = async () => {
    mapObject.sharedWith.concat(connectionToShareWith);
    Object.assign(mapObject, {
      sharedWith: mapObject.sharedWith.concat(connectionToShareWith),
    });
    userData.mapsOwned.forEach((map) => {
      if (map.mapID === mapObject.mapID) {
        Object.assign(map, {
          sharedWith: mapObject.sharedWith,
        });
      }
    });
    const userRef = doc(db, "users", userAuth.uid);
    await updateDoc(userRef, {
      mapsOwned: JSON.parse(JSON.stringify(userData.mapsOwned)),
    });
    if (!mapObject.isPrivate) {
      const mapRef = doc(db, "publicMaps", mapObject.mapID);
      await updateDoc(mapRef, {
        mapObject: JSON.parse(JSON.stringify(mapObject)),
      });
    }
    const connectionRef = doc(db, "users", connectionToShareWith.userId);
    const fetchConnectionData = await getDoc(connectionRef);
    const fetchedSharedWithData = fetchConnectionData.data().mapsSharedWithUser;
    const updatedSharedWithData = fetchedSharedWithData.concat({
      mapID: mapObject.mapID,
      ownerId: mapObject.owner.ownerId,
    });
    await updateDoc(connectionRef, {
      mapsSharedWithUser: updatedSharedWithData,
    });
    setConnectionToShareWith(null);
  };

  const isMapSaved = () => {
    return userData.publicMapsSaved.map((data) => data.mapID);
  };

  const isMapSharedWith = () => {
    return userData.mapsSharedWithUser.map((data) => data.mapID);
  };

  const getSharedWithList = () => {
    const string = `Shared with `;
    let newString;
    const namesArray = mapObject.sharedWith.map((connection) => {
      return connection.userName;
    });
    if (namesArray.length === 1) {
      newString = `Shared with ${namesArray[0]}.`;
    } else if (namesArray.length === 2) {
      newString = `Shared with ${namesArray[0]} and ${namesArray[1]}.`;
    } else {
      for (let i = 0; i < namesArray.length; i++) {
        if (i === 0) {
          newString = string.concat(``, namesArray[i]);
        } else if (i === namesArray.length - 1) {
          newString = newString.concat(` and `, namesArray[i]);
          newString = newString.concat(``, `.`);
        } else {
          newString = newString.concat(`, `, namesArray[i]);
        }
      }
    }
    return newString;
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
        ></div>
        <div
          data-hover={
            mapObject.owner.ownerId === userAuth.uid
              ? "You own this map."
              : "Map is shared with you."
          }
          className={
            userData &&
            (mapObject.owner.ownerId === userAuth.uid ||
              isMapSharedWith().includes(mapObject.mapID))
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
      <div className="display-shared-with-container">
        {userData &&
        mapObject.sharedWith.length &&
        userAuth.uid === mapObject.owner.ownerId
          ? getSharedWithList()
          : null}
      </div>
      <div className="comments-container" id={`comment-box-${mapObject.mapID}`}>
        {mapObject.comments.map((commentObject, index) => {
          return (
            <div className="comment" key={`comment${index}`}>
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
      {/* <button
        onClick={() =>
          console.log({
            userData,
            userAuth,
            mapObject,
            publicMaps,
            mapsSavedByUser,
            mapsSharedWithUser,
          })
        }
      >
        Check State
      </button> */}
    </div>
  );
}

export default Engagement;
