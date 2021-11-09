const sortBounds = require("./sortBounds");

test("sorts lat and long for SW and NE bounds", () => {
  const objectArray = [
    { lat: 0, lng: -7 },
    { lat: -2, lng: -5 },
    { lat: -3, lng: -3 },
    { lat: 5, lng: -3 },
    { lat: -3, lng: -10 },
    { lat: 4, lng: -6 },
    { lat: 5, lng: -10 },
  ];
  expect(sortBounds(objectArray)).toEqual([
    {
      lat: -3,
      lng: -10,
    },
    {
      lat: 5,
      lng: -3,
    },
  ]);
});
