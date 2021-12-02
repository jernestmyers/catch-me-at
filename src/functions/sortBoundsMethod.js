function sortBounds(array) {
  const latArray = [...array];
  const lngArray = [...array];
  latArray.sort((a, b) => {
    return a.coordinates.lat - b.coordinates.lat;
  });
  lngArray.sort((a, b) => {
    return a.coordinates.lng - b.coordinates.lng;
  });
  return [
    { lat: latArray[0].coordinates.lat, lng: lngArray[0].coordinates.lng },
    {
      lat: latArray[latArray.length - 1].coordinates.lat,
      lng: lngArray[lngArray.length - 1].coordinates.lng,
    },
  ];
}

export default sortBounds;
