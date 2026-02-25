
import axios from "axios";

export const getAxiosInstance = () =>
  axios.create({
    baseURL: process.env.NEXT_API_URL, 
    headers: {
      "Content-Type": "application/json",
        "Accept" : "application/json",
    },
});
