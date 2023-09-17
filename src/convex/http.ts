import { httpRouter } from "convex/server";
import { userDisconnected } from "./httpactions";

const http = httpRouter();

http.route({
  path: "/userDisconnected",
  method: "POST",
  handler: userDisconnected,
});

export default http;