import React, { useState } from "react";
import MapComponent from "./components/Map.js";
import ShowMap from "./components/ShowMap.js";
import "./App.css";

function App() {
  const [mapsSaved, setMapsSaved] = useState([
    {
      mapID: "123456",
      marker: [
        { lat: 0.032958, lng: 179.604 },
        { lat: 76.059, lng: 150.495 },
      ],
      info: [
        {
          id: "abcd",
          data: [
            { id: "place", value: "ocean" },
            { id: "date", value: "today" },
            { id: "time", value: "now" },
            { id: "what", value: "diving" },
          ],
        },
        {
          id: "efgh",
          data: [
            { id: "place", value: "somewhere" },
            { id: "date", value: "tomorrow" },
            { id: "time", value: "not now" },
            { id: "what", value: "no idea" },
          ],
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <header className="App-header">catch me at _______</header>
      <MapComponent
        mapsSaved={mapsSaved}
        setMapsSaved={setMapsSaved}
      ></MapComponent>
      {/* {mapsSaved */}
      {mapsSaved.map((object, index) => {
        return <ShowMap mapObject={object}></ShowMap>;
      })}
      {/* : null} */}
      {/* {mapsSaved.map((object, index) => {
        <ShowMap mapObject={object}></ShowMap>;
      })} */}
      <button onClick={() => console.log(mapsSaved)}>see mapsSaved</button>
    </div>
  );
}

export default App;
