import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:3000";

export default axios.create({
  baseURL: API_URL,
  transformRequest: [
    function(data, headers) {
      headers["x-auth"] = localStorage.token;
      return JSON.stringify(data);
    }
  ],
  headers: {
    "Content-Type": "application/json"
  }
});
