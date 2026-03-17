const ensureToastRoot = () => {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  return wrap;
};

const showToast = (message, type = "info") => {
  const wrap = ensureToastRoot();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.borderColor = type === "error" ? "rgba(255,77,109,0.5)" : "rgba(0,212,255,0.35)";
  toast.textContent = message;
  wrap.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
};

const attachLogout = () => {
  document.querySelectorAll("[data-logout]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  });
};

const setActiveSidebar = () => {
  const current = location.pathname.split("/").pop() || "index";
  document.querySelectorAll(".sidebar a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.includes(current.replace(".html", ""))) link.classList.add("active");
  });
};
