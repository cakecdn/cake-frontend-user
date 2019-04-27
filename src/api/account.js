import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL;

export const requestLogin = body => {
  return axios
    .post(`${host}/public/login`, body)
    .then(res => res.data)
    .catch(error => error);
};
export const changePassword = body => {
  return axios.post(`${host}/password`, body).then(res => res.data);
};
