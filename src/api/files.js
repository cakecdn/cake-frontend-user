import axios from "axios";

// let host = process.env.VUE_APP_API_BASE_URL + "/user-endpoint";

export const listFiles = (host, userId, path) => {
  return axios
    .get(`${host}/${userId}/${path}`)
    .then(res => res.data)
    .catch(error => error);
};

export const addFolder = (host, userId, path, body) => {
  return axios
    .post(`${host}/mkdir/${userId}/${path}`, body)
    .then(res => res.data)
    .catch(error => error);
};
