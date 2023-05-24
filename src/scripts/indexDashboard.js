import { userLogout } from "./dashboardButtons.js";
import { openEditProfileModal } from "./modal.js";
import { renderCoWorkers, renderUserInfo } from "./render.js";
import { verifyUserType } from "./requests.js";

await renderUserInfo();
async function authentication() {
  const token = localStorage.getItem("@kEmpresa:logintoken");

  if (!token) {
    window.location.replace("../../index.html");
  }
}

userLogout();
authentication();
openEditProfileModal();
renderCoWorkers()
