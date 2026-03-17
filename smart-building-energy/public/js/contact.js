const submitContact = async (event) => {
  event.preventDefault();
  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  };

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) return showToast(data.message || "Failed to submit", "error");

  showToast("Message sent successfully");
  event.target.reset();
};

const loadAdminMessages = async () => {
  const user = getUser();
  if (!user || user.role !== "admin") return;

  const res = await authFetch("/api/contact");
  if (!res.ok) return;
  const messages = await res.json();

  const tableBody = document.getElementById("admin-messages");
  if (!tableBody) return;

  tableBody.innerHTML = messages
    .slice(0, 10)
    .map((m) => `<tr><td>${m.name}</td><td>${m.email}</td><td>${m.subject}</td><td>${new Date(m.createdAt).toLocaleDateString()}</td></tr>`)
    .join("");
};

const initContact = async () => {
  attachLogout();
  setActiveSidebar();
  document.getElementById("contact-form").addEventListener("submit", submitContact);
  await loadAdminMessages();
};

document.addEventListener("DOMContentLoaded", initContact);
