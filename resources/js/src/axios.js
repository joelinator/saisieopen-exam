// axios
import axios from "axios";

const baseURL = "http://127.0.0.1:5001";
// const baseURL = 'http://72.249.62.23:5001'
// esper
// const baseURL = "http://72.249.62.92:5001"

//upgrade
//const baseURL = "http://72.249.62.74:8000";

function getToken() {
    return localStorage.getItem("accessToken");
}

export const auth_axios = axios.create({
    baseURL
});

const instance = axios.create({
    baseURL,
    headers: { Authorization: getToken() ? "Bearer " + getToken() : null }
    // You can add your headers here
});

instance.interceptors.response.use(
    res => res,
    err => {
        const originalRequest = error.config;
        if (
            getToken() &&
            err.response.status === 401 &&
            error.response.data.status === "Token is Expired"
        ) {
            instance
                .post("api/newauth/refresh/")
                .then(response => {
                    localStorage.setItem(
                        "accessToken",
                        response.data.access_token
                    );

                    instance.defaults.headers["Authorization"] =
                        "Bearer " + getToken();
                    originalRequest.headers["Authorization"] =
                        "Bearer " + getToken();

                    return instance(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        }
        return Promise.reject(err);
    }
);

export default instance;
