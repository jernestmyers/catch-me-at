import React from "react";

const ItineraryForm = (props) => {
  //   console.log(props.isEditClicked);

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
        <button onClick={props.addMarkerAndInfo} className="add-details-btn">
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
      <button className="add-details-btn" onClick={props.cancelAddMarker}>
        cancel
      </button>
    </form>
  );
};

export default ItineraryForm;
