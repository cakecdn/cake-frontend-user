import axios from "axios";

let host = process.env.API_BASE_URL;

export default {
  getUserInfo() {
    return axios
      .get(`${host}/api/user-info`)
      .then(response => Promise.resolve(response.data.data))
      .catch(error => Promise.reject(error));
  }
};
