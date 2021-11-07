import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

export const Maps = (props) => {
  const mapStyles = {
    width: "100%",
    height: "100%",
  };

  return (
    <Map
      google={props.google}
      zoom={8}
      style={mapStyles}
      initialCenter={{ lat: 9.761927, lng: 79.95244 }}
    >
      <Marker position={{ lat: 9.761927, lng: 79.95244 }} />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_API_KEY,
})(Maps);
