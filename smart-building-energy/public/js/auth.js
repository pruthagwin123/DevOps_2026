const API_BASE = "";
const TOKEN_KEY = "sbes_token";
const USER_KEY = "sbes_user";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch (_) {
    return null;
  }
};

const ensureLoader = () => {
  let loader = document.querySelector(".global-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.className = "global-loader";
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  }
  return loader;
};

const showLoader = () => {
  const loader = ensureLoader();
  loader.style.display = "flex";
};

const hideLoader = () => {
  const loader = document.querySelector(".global-loader");
  if (loader) loader.style.display = "none";
};

const authFetch = async (url, options = {}) => {
  showLoader();
  try {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
    if (response.status === 401) {
      clearToken();
      if (!location.pathname.includes("login.html") && !location.pathname.endsWith("/login")) {
        location.href = "/login";
      }
    }
    return response;
  } finally {
    hideLoader();
  }
};

const requireAuth = () => {
  if (!getToken()) {
    location.href = "/login";
  }
};

const logout = () => {
  clearToken();
  location.href = "/login";
};
