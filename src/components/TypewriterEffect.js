import "../styles/TypewriterEffect.css";

function TypewriterEffect() {
  const placeString = [
    `The Wissahickon.`,
    `The Fillmore.`,
    `Penn Treaty Park.`,
    `The Barnes Foundation.`,
  ];

  //   document.addEventListener("DOMContentLoaded", function (event) {
  // type one text in the typwriter
  // keeps calling itself until the text is finished
  function typeWriter(text, i, fnCallback) {
    // chekc if text isn't finished yet
    if (i < text.length) {
      // add next character to h1
      document.querySelector("#typed-text").innerHTML =
        text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

      // wait for a while and call this function again for next character
      setTimeout(function () {
        typeWriter(text, i + 1, fnCallback);
      }, 100);
    }
    // text finished, call callback if there is a callback function
    else if (typeof fnCallback == "function") {
      // call callback after timeout
      setTimeout(fnCallback, 700);
    }
  }
  // start a typewriter animation for a text in the dataText array
  function StartTextAnimation(i) {
    // LOOPS THE TYPEWRITER
    //   if (typeof placeString[i] == "undefined") {
    //     setTimeout(function () {
    //       StartTextAnimation(0);
    //     }, 10000);
    //   }
    // check if dataText[i] exists
    //   if (i < placeString[i].length) {
    if (placeString[i]) {
      // text exists! start typewriter animation
      typeWriter(placeString[i], 0, function () {
        // after callback (and whole text has been animated), start next text
        StartTextAnimation(i + 1);
      });
    }
  }
  // start the text animation
  StartTextAnimation(0);
  //   });
}

export default TypewriterEffect;

// import React, { useEffect } from "react";
// import "../styles/TypewriterEffect.css";

// function TypewriterEffect() {
//   const placeString = [
//     `The Wissahickon.`,
//     `The Fillmore.`,
//     `Penn Treaty Park.`,
//     `The Barnes Foundation.`,
//   ];

//   //   useEffect(() => {
//   console.log(`typewriter mounted`);
//   //   document.addEventListener("DOMContentLoaded", function (event) {
//   // type one text in the typwriter
//   // keeps calling itself until the text is finished
//   function typeWriter(text, i, fnCallback) {
//     // chekc if text isn't finished yet
//     if (i < text.length) {
//       // add next character to h1
//       document.querySelector("#typed-text").innerHTML =
//         text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

//       // wait for a while and call this function again for next character
//       setTimeout(function () {
//         typeWriter(text, i + 1, fnCallback);
//       }, 100);
//     }
//     // text finished, call callback if there is a callback function
//     else if (typeof fnCallback == "function") {
//       // call callback after timeout
//       setTimeout(fnCallback, 700);
//     }
//   }
//   // start a typewriter animation for a text in the dataText array
//   function StartTextAnimation(i) {
//     // LOOPS THE TYPEWRITER
//     if (typeof placeString[i] == "undefined") {
//       setTimeout(function () {
//         StartTextAnimation(0);
//       }, 10000);
//     }
//     // check if dataText[i] exists
//     //   if (i < placeString[i].length) {
//     if (placeString[i]) {
//       // text exists! start typewriter animation
//       typeWriter(placeString[i], 0, function () {
//         // after callback (and whole text has been animated), start next text
//         StartTextAnimation(i + 1);
//       });
//     }
//   }
//   // start the text animation
//   StartTextAnimation(0);
//   //   });
//   //   }, []);

//   return (
//     <div id="typewriter-container">
//       <div id="typewriter-prefix">Catch me at&nbsp;</div>
//       <div id="typed-text-container">
//         <div id="typed-text"></div>
//       </div>
//     </div>
//   );
// }

// export default TypewriterEffect;
