import api from "./axiosIns";

export const signupUser = async (data) => {
  const res = await api.post("/signup", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/login", data);
  return res.data;
};
