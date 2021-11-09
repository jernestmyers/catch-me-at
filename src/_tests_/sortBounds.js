function sortBounds(array) {
  //   const sortLat = array.sort((a, b) => {
  //     return a.lat - b.lat;
  //   });
  //   const sortLng = sortLat.sort((a, b) => {
  //     return a.lng - b.lng;
  //   });
  const sortLatLng = array
    .sort((a, b) => {
      return a.lat - b.lat;
    })
    .sort((a, b) => {
      return a.lng - b.lng;
    });
  return { sw: sortLatLng[0], ne: sortLatLng[sortLatLng.length - 1] };
}
module.exports = sortBounds;
