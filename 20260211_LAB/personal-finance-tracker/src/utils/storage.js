const DATA_KEY = "pft-data";
const AUTH_KEY = "pft-authed";

export const loadData = (fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(DATA_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed || fallback;
  } catch (error) {
    return fallback;
  }
};

export const saveData = (data) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
};

export const loadAuth = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_KEY) === "true";
};

export const saveAuth = (value) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_KEY, value ? "true" : "false");
};
