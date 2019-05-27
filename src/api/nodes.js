import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/user-endpoint";

export const listNodes = () => {
  return axios
    .get(`${host}/nodes`)
    .then(res => res.data)
    .catch(error => error);
};
