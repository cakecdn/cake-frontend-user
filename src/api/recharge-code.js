import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/user-endpoint";

export const getRechargeCode = path => {
  return axios
    .get(`${host}/recharge-codes/${path[0]}`)
    .then(res => res.data)
    .catch(error => error);
};

export const useRechargeCode = path => {
  return axios
    .post(`${host}/recharge-codes/${path[0]}`)
    .then(res => res.data)
    .catch(error => error);
};
