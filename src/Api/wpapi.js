import WPAPI from "wpapi";
import { config } from "../../config";

export const wpapi = new WPAPI({
  endpoint:
    ("/" === config.baseUrl.slice(-1) ? config.baseUrl : config.baseUrl + "/") +
    "wp-json",
});
