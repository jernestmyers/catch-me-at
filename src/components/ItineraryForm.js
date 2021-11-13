import React, { useState } from "react";
import { clearContainer, clearFormInputs } from "../functions/helperDOMMethods";
import uniqid from "uniqid";

const ItineraryForm = (props) => {
  //   console.log(props.isEditClicked);

  const cancelAddMarker = (e) => {
    e.preventDefault();
    clearContainer(document.querySelector(`#where-data`));
    clearFormInputs(document.querySelectorAll(`.input-field`));
    // document.querySelector(`#add-marker-details`).style.display = `none`;
  };

  return (
    <form id="add-marker-details">
      <div id="where-container">
        <h2>WHERE</h2>
        <div id="where-data"></div>
      </div>
      <div id="when-container">
        <h2>WHEN</h2>
        <div className="form-field">
          <label htmlFor="when">date:</label>
          <input className="input-field" type="date" id="date" />
        </div>
        <div className="form-field">
          <label htmlFor="when-time">time:</label>
          <input className="input-field" type="time" id="time" />
        </div>
      </div>
      <div className="form-field">
        <h2>WHAT</h2>
        <label htmlFor="what">the plan:</label>
        <textarea className="input-field" id="what" rows="5"></textarea>
      </div>
      {!props.isEditClicked ? (
        <button onClick={props.handleMarkerAndInfo} className="add-details-btn">
          add
        </button>
      ) : (
        <button
          onClick={props.confirmEditsToMarkerAndData}
          id="edit-details-btn"
        >
          confirm edit
        </button>
      )}
      <button className="add-details-btn" onClick={cancelAddMarker}>
        cancel
      </button>
    </form>
  );
};

export default ItineraryForm;
