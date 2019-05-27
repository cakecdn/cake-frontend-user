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

export const fetchUserProfiles = (context) => {
  return services.userProfile
    .getUserProfile()
    .then(response => {
      context.commit(types.FETCH_USER_PROFILE, response);
    })
    .catch(error => {
      console.error(error);
    });
};
