import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/admin-endpoint";

export const listUsers = params => {
  return axios.get(`${host}/users`, { params: params }).then(res => res.data);
};

export const addUser = body => {
  return axios.post(`http://localhost:9002/users`, body).then(res => res.data);
};
