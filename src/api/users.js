import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/user-endpoint";

export const listUsers = params => {
  return axios.get(`${host}/users`, { params: params }).then(res => res.data);
};

export const addUser = body => {
  return axios.post(`${host}/users`, body).then(res => res.data);
};

export const editUser = (body, path) => {
  return axios.put(`${host}/users/${path[0]}`, body).then(res => res.data);
};

export const deleteUser = path => {
  return axios.delete(`${host}/users/${path[0]}`).then(res => res.data);
};
