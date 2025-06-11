// import { CLIENT_ID } from "@/lib/constants";
import axios from "axios";

const spotifyApi = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}

let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        client_id: "e5ebcd8b4a1447c2a5d6306a19f01d94",
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token: new_refresh_token } = response.data;
    localStorage.setItem("access_token", access_token);
    if (new_refresh_token) {
      localStorage.setItem("refresh_token", new_refresh_token);
    }

    return access_token;
  } catch (error) {
    return Promise.reject(error);
  }
};

spotifyApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
spotifyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return spotifyApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = await refreshToken();
        processQueue(null, token);
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        isRefreshing = false;
        return spotifyApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default spotifyApi;
