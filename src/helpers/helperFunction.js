export const getDateFormat = (startDate, endDate) => {
  if (
    startDate !== null &&
    endDate !== null &&
    startDate !== "" &&
    endDate !== "" &&
    startDate !== undefined &&
    endDate !== undefined
  ) {
    let newData = new Date(startDate);
    let newData1 = new Date(endDate);
    let sDate = newData.getFullYear() + "-" + (newData.getMonth() + 1) + "-" + newData.getDate();
    let eDate = newData1.getFullYear() + "-" + (newData1.getMonth() + 1) + "-" + newData1.getDate();

    return {
      sDate,
      eDate,
    };
  } else {
    let sDate = "";
    let eDate = "";
    return {
      sDate,
      eDate,
    };
  }
};
