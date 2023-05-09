import moment from "moment-timezone";

export const generateRandomStr = () => {
  const date = moment.tz(moment(), "Asia/Tokyo").format("YYYY-MM-DD");
  return date + "-1";
};
