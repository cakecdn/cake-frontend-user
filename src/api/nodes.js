import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/admin-endpoint";

export const listNodes = params => {
  return axios
    .get(`${host}/nodes`, { params: params })
    .then(res => res.data)
    .catch(error => error);
};

export const addNode = body => {
  return axios.post(`${host}/nodes`, body).then(res => res.data);
};

export const editNode = (body, path) => {
  return axios.put(`${host}/nodes/${path[0]}`, body).then(res => res.data);
};

export const deleteNode = path => {
  return axios.delete(`${host}/nodes/${path[0]}`).then(res => res.data);
};
