import React from "react";

const ItineraryForm = (props) => {
  return (
    <form id="add-marker-details">
      <div id="where-container">
        <h2 className="form-section-header">WHERE</h2>
        <div id="where-data"></div>
      </div>
      <div id="when-container">
        <h2 className="form-section-header">WHEN</h2>
        <div className="form-field when-form">
          <label htmlFor="when">Date:</label>
          <input className="input-field" type="date" id="date" />
        </div>
        <div className="form-field when-form">
          <label htmlFor="when-time">Time:</label>
          <input className="input-field" type="time" id="time" />
        </div>
      </div>
      <div className="form-field">
        <h2 className="form-section-header">WHAT</h2>
        <label htmlFor="what"></label>
        <textarea className="input-field" id="what" rows="5"></textarea>
      </div>
      <div id="form-btns">
        {!props.isEditMarkerClicked ? (
          <button onClick={props.addMarkerAndInfo} className="add-details-btn">
            Add
          </button>
        ) : (
          <button
            className="add-details-btn"
            onClick={props.submitEditsToMarker}
            id="update-marker-btn"
          >
            Update Item
          </button>
        )}
        {!props.isEditMarkerClicked ? (
          <button className="add-details-btn" onClick={props.cancelAddMarker}>
            Cancel
          </button>
        ) : (
          <button
            className="add-details-btn"
            onClick={props.cancelEditMarker}
            id="cancel-marker-edit-btn"
          >
            Cancel Update
          </button>
        )}
      </div>
    </form>
  );
};

export default ItineraryForm;
