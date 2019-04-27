import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/admin-endpoint";

export const listNodes = params => {
  return axios
    .get(`${host}/nodes`, { params: params })
    .then(res => res.data)
    .catch(error => error);
};
