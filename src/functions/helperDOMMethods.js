function clearContainer(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function clearFormInputs(parent) {
  parent.forEach((input) => {
    input.value = ``;
  });
}

function createWhereElements(placeObject) {
  const placeName = document.createElement(`p`);
  placeName.textContent = placeObject.name;
  const placeAddress = document.createElement(`p`);
  placeAddress.textContent = placeObject.formatted_address;
  const placeGoogleUrl = document.createElement(`a`);
  placeGoogleUrl.href = placeObject.url;
  placeGoogleUrl.textContent = `View on Google Maps`;
  return [placeName, placeAddress, placeGoogleUrl];
}

function appendWhereElements(parent, elementArray) {
  parent.appendChild(elementArray[0]);
  parent.appendChild(elementArray[1]);
  parent.appendChild(elementArray[2]);
}

export {
  clearContainer,
  clearFormInputs,
  createWhereElements,
  appendWhereElements,
};
