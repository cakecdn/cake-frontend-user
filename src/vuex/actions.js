import * as types from "./mutation-types";
import { services } from "./api";

export const fetchProduct = ({ commit }) => {
  return services.products
    .getAll()
    .then(response => {
      commit(types.FETCH_PRODUCT, response.data);
    })
    .catch(error => {
      console.error(error);
    });
};

export const fetchUserInfo = context => {
  return services.userInfo
    .getUserInfo()
    .then(response => {
      context.commit(types.WIZARD_USER_INFO, response);
    })
    .catch(error => {
      console.error(error);
    });
};
