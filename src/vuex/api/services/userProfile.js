import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/user-endpoint";

export default {
  getUserProfile() {
    return axios
      .get(`${host}/user-profiles`)
      .then(res => res.data)
      .catch(error => error);
  }
};
