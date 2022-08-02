import axios from "axios";

export default function baseAxiosInstance() {
  return axios.create({
    baseURL: "https://roc8-dev-net.vercel.app/api",
    withCredentials: true,
  });
}
