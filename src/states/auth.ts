import { NavigateFunction } from "react-router-dom";
import { create } from "zustand";
import Cookies from "js-cookie";
import { userLogin, userRegister } from "../types";
import { TOKEN, USERID } from "../constants";
import { request } from "../request";
import { toast } from "react-toastify";

type AuthTypes = {
  isAuthenticated: boolean;
  login: (data: userLogin, navigate: NavigateFunction) => void;
  logout: (navigate: NavigateFunction) => void;
  register: (data: userRegister, navigate: NavigateFunction) => void;
  userId: string;
};

export const useAuth = create<AuthTypes>((set) => ({
  isAuthenticated: Cookies.get(TOKEN) ? true : false,
  userId: Cookies.get(USERID) || "",
  login: async (data, navigate) => {
    try {
      const res = await request.post("user/login/", data);
      console.log(res.data, "data");
      toast.success("User logged in successfully");
      function isTokenExpired(accessToken: string) {
        const arrayToken = accessToken.split(".");
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        return tokenPayload;
      }
      isTokenExpired(res.data.access);
      const tokenUser = isTokenExpired(res.data.access);
      console.log(tokenUser, "tokenExpired");

      Cookies.set(TOKEN, res.data.access);
      Cookies.set(USERID, tokenUser.user_id);
      set({ isAuthenticated: true, userId: tokenUser.user_id });
      navigate("/home");
    } catch (err) {
      toast.error("UserName or Password is incorrect");
      console.log(err);
    }
  },
  logout: (navigate) => {
    Cookies.remove(TOKEN);
    set({ isAuthenticated: false });
    navigate("/");
  },
  register: async (data, navigate) => {
    try {
      const res = await request.post("user/user-create/", data);
      Cookies.set(TOKEN, res.data.access);
      console.log(res, "res");
      toast.success("User created")
      set({ isAuthenticated: true });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  },
}));
