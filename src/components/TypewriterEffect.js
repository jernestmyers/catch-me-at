import React, { useEffect } from "react";
import "../styles/TypewriterEffect.css";

function TypewriterEffect(props) {
  const placeString = [
    `The Wissahickon.`,
    `The Fillmore.`,
    `Penn Treaty Park.`,
    `The Barnes Foundation.`,
  ];

  useEffect(() => {
    console.log(`typewriter mounted`);
    // document.addEventListener("DOMContentLoaded", function (event) {
    const typedTextContainer = document.querySelector("#typed-text");
    document.querySelector("#typewriter-container").style.display = `grid`;

    function typeWriter(text, i, fnCallback) {
      if (i < text.length) {
        typedTextContainer.innerHTML =
          text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

        setTimeout(function () {
          if (!props.userAuth) {
            typeWriter(text, i + 1, fnCallback);
          }
        }, 100);
      } else if (typeof fnCallback == "function") {
        setTimeout(fnCallback, 700);
      }
    }
    function StartTextAnimation(i) {
      if (typeof placeString[i] == "undefined") {
        setTimeout(function () {
          StartTextAnimation(0);
        }, 10000);
      }
      if (placeString[i] && !props.userAuth) {
        typeWriter(placeString[i], 0, function () {
          StartTextAnimation(i + 1);
        });
      }
    }
    StartTextAnimation(0);
    // });
  }, [props.userAuth, props.setUserAuth]);

  return (
    <div id="typewriter-container">
      <div id="typewriter-prefix">Catch me at&nbsp;</div>
      <div id="typed-text-container">
        <div id="typed-text"></div>
      </div>
    </div>
  );
}

export default TypewriterEffect;
