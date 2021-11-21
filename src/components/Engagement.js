import { format, parseJSON } from "date-fns";
import React from "react";
import {
  // collection,
  // getDocs,
  // getDoc,
  // setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function Engagement({ db, mapObject, userAuth }) {
  console.log({ mapObject, userAuth });

  const handleAddComment = (e) => {
    const mapID = e.target.closest(`div`).dataset.mapid;
    document.querySelector(`#comment-box-${mapID}`).style.display === "block"
      ? (document.querySelector(`#comment-box-${mapID}`).style.display = `none`)
      : (document.querySelector(
          `#comment-box-${mapID}`
        ).style.display = `block`);
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
    if (commentTextarea.value) {
      const comment = {
        userId: userAuth.uid,
        name: userAuth.displayName,
        date: JSON.stringify(new Date()),
        comment: commentTextarea.value,
      };
      const updatedCommentObject = {
        comments: [...mapObject.comments, comment],
      };
      Object.assign(mapObject, updatedCommentObject);
      updateFirestore(e.target.dataset.mapid);
      commentTextarea.value = ``;
    }
  };

  const showDate = (dateObject) => {
    return format(dateObject, "MMM d, yyyy, h:mmaaa");
  };

  const updateFirestore = async (id) => {
    if (!mapObject.isPrivate) {
      console.log(`update publicMap`);
      const docRef = doc(db, "publicMaps", id);
      await updateDoc(docRef, { mapObject });
    }
    if (userAuth.uid === mapObject.owner.ownerId) {
      console.log(`user owns map, update it.`);
    }
    if (mapObject.isPrivate && userAuth.uid === mapObject.owner.ownerId) {
      console.log(
        `map isPrivate AND not the user's, so map is shared with user`
      );
    }
  };

  return (
    <div id="engagement-container">
      <div className="display-engagement-data">
        <div className="numberOfLikes">{mapObject.likes}</div>
        <div
          className="numberOfComments"
          data-mapid={mapObject.mapID}
          onClick={handleAddComment}
        >
          {mapObject.comments.length ? (
            <p>
              {mapObject.comments.length}
              {mapObject.comments.length === 1 ? ` comment` : ` comments`}
            </p>
          ) : (
            <p>Be the first to comment!</p>
          )}
        </div>
      </div>
      <div className="engage-btns-bar">
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
    </div>
  );
}

export default Engagement;
