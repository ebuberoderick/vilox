import axios from "axios";
import Cookies from "js-cookie";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.viloxapp.com/api/";

const timeoutConfig = {
  timeout: 30000,
  timeoutErrorMessage: "Server taking too long to respond. Try again.",
};

export const apiWithOutAuth = axios.create({
  baseURL: API_BASE_URL,
  withCredentials:true, 
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  ...timeoutConfig,
});

export const apiWithAuth = axios.create({
  baseURL: API_BASE_URL,
  withCredentials:true, 
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("jwt")}`,
  },
  ...timeoutConfig,
});

export const getApiResponse = (data) => {
// errors
  return {
    status: true,
    data: data.data,
  };
};

export const getErrorResponse = (error) => {
  // errors
  return {
    status: false,
    data: error?.response?.data,
  };
};
