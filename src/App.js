import React from "react";
import MyComponent from "./components/Map.js";
import "./App.css";

function App() {
  // const [isMapClicked, setIsMapClicked] = useState(false);

  return (
    <div className="App">
      <header className="App-header">catch me at _______</header>
      <MyComponent
      // isMapClicked={isMapClicked}
      // setIsMapClicked={setIsMapClicked}
      ></MyComponent>
      {/* {isMapClicked ? <button>Add Marker</button> : null} */}
      {/* <button id="add-marker-btn">Add Marker</button> */}
    </div>
  );
}

export default App;
