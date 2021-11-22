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
  placeName.classList.add(`itin-where-text`);
  const placeAddress = document.createElement(`p`);
  placeAddress.textContent = placeObject.formatted_address;
  const placeGoogleUrl = document.createElement(`a`);
  placeGoogleUrl.href = placeObject.url;
  placeGoogleUrl.target = `_blank`;
  placeGoogleUrl.rel = `noreferrer`;
  placeGoogleUrl.textContent = `View on Google Maps`;
  return [placeName, placeAddress, placeGoogleUrl];
}

function appendWhereElements(parent, elementArray) {
  parent.appendChild(elementArray[0]);
  parent.appendChild(elementArray[1]);
  parent.appendChild(elementArray[2]);
}

function getFormData(inputs) {
  const data = [];
  inputs.forEach((input) => {
    data.push({ id: input.id, value: input.value });
  });
  return data;
}

function getMapTitle(titleInput) {
  if (!titleInput.value) {
    return titleInput.placeholder;
  } else {
    return titleInput.value;
  }
}

function getMapStatusValues() {
  const publishCheckbox = document.querySelector(`#publish-checkbox`);
  const privateCheckbox = document.querySelector(`#private-checkbox`);
  const getDatePublished = () => {
    if (publishCheckbox.checked) {
      return new Date();
    }
  };
  return {
    datePublished: getDatePublished(),
    isPublished: publishCheckbox.checked,
    isPrivate: privateCheckbox.checked,
  };
}

function clearTitleAndStatus() {
  document.querySelector(`#publish-checkbox`).checked = ``;
  document.querySelector(`#private-checkbox`).checked = ``;
  document.querySelector(`#map-title-input`).value = ``;
}

export {
  clearContainer,
  clearFormInputs,
  clearTitleAndStatus,
  createWhereElements,
  appendWhereElements,
  getFormData,
  getMapStatusValues,
  getMapTitle,
};
