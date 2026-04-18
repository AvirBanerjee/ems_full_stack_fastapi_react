import API from '../api/axios';

// LOGIN (OAuth2 - form data)
export const login = async (data) => {
    const form = new URLSearchParams();
    form.append("username", data.email);   "username"
    form.append("password", data.password);

    const res = await API.post("/login", form, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    localStorage.setItem("token", res.data.access_token);
    return res.data;
};



export const register = async (data) => {
    return API.post("/register", data);
};



export const logout = () => {
    localStorage.removeItem("token");
};