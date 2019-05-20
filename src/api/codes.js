import axios from "axios";

let host = process.env.VUE_APP_API_BASE_URL + "/admin-endpoint";

export const listCodes = params => {
  return axios
    .get(`${host}/recharge-code`, { params: params })
    .then(res => res.data)
    .catch(error => error);
};

export const addCode = params => {
  return axios
    .post(
      `${host}/recharge-code?number=${params.number}&days=${
        params.days
      }&trafficBytes=${params.trafficBytes}`
    )
    .then(res => res.data);
};

export const deleteCode = path => {
  return axios.delete(`${host}/recharge-code/${path[0]}`).then(res => res.data);
};

export const batchDeleteCodes = body => {
  return axios
    .post(`${host}/recharge-code/batch-remove`, body)
    .then(res => res.data);
};
