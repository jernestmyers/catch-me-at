import React, { useState } from "react";
import uniqid from "uniqid";

const ItineraryForm = (props) => {
  //   console.log(props.isEditClicked);
  return (
    <form id="add-marker-details">
      <div className="form-field">
        <label htmlFor="location">where:</label>
        <input className="input-field" type="text" id="place" />
      </div>
      <div className="form-field">
        <label htmlFor="when">date:</label>
        <input className="input-field" type="date" id="date" />
      </div>
      <div className="form-field">
        <label htmlFor="when-time">time:</label>
        <input className="input-field" type="time" id="time" />
      </div>
      <div className="form-field">
        <label htmlFor="what">the plan:</label>
        <textarea
          className="input-field"
          id="what"
          rows="5"
          cols="50"
        ></textarea>
      </div>
      {!props.isEditClicked ? (
        <button onClick={props.handleMarkerAndInfo} className="add-details-btn">
          add
        </button>
      ) : (
        <button onClick={props.editMarker} id="edit-details-btn">
          confirm edit
        </button>
      )}
      <button className="add-details-btn" onClick={props.cancelAdd}>
        cancel
      </button>
    </form>
  );
};

export default ItineraryForm;
