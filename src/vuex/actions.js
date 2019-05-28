import * as types from "./mutation-types";
import { services } from "./api";

export const fetchUserTraffic = (context) => {
  return services.userTraffic
    .getUserTraffic()
    .then(response => {
      context.commit(types.FETCH_USER_TRAFFIC, response);
    })
    .catch(error => {
      console.error(error);
    });
};
