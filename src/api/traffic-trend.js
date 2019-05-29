import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/user-endpoint";

export const getTrafficTrend = path => {
  return axios
    .get(`${host}/traffic-trend/users/${path[0]}`)
    .then(res => res.data)
    .catch(error => error);
};
