export const setToken = (token) => {
  window.localStorage.setItem("LoginToken", token);
};

export const getToken = () => {
  return window.localStorage.getItem("LoginToken");
};

export const isLogin = () => {
  return window.localStorage.getItem("LoginToken");
};

export const getUserData = () => {
  return window.localStorage.getItem("IsProvider");
};


export const logout = () => {
  window.localStorage.clear();
  window.location.reload();
};

