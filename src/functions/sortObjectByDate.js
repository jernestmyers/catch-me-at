import { compareAsc } from "date-fns";

function sortObjectByDate(markersArray) {
  const getDateObject = (dateObjectArray) => {
    const year = dateObjectArray[0].substring(0, 4);
    const month = +dateObjectArray[0].substring(5, 7);
    const day = dateObjectArray[0].substring(8, 10);
    const hour = dateObjectArray[1].substring(0, 2);
    const minute = dateObjectArray[1].substring(3, 5);
    return new Date(year, month - 1, day, hour, minute);
  };

  const sortedMarkersByDate = [...markersArray];
  sortedMarkersByDate.forEach((marker) => {
    Object.assign(marker, {
      formattedDate: getDateObject([
        marker.userInputData[0].value,
        marker.userInputData[1].value,
      ]),
    });
  });
  sortedMarkersByDate.sort((a, b) => {
    return compareAsc(a.formattedDate, b.formattedDate);
  });

  return sortedMarkersByDate;
}

export { sortObjectByDate };
