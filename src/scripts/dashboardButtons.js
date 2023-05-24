import { openDepartamentModal } from "./modal.js"
import { renderUserInfo } from "./render.js"
import { getUserInfo } from "./requests.js"


export function userLogout () {
    const logoutBtn = document.querySelector('.dashboard__logout')

    logoutBtn.addEventListener('click', () => {
        localStorage.clear()
        window.location.replace('../pages/login.html')
    })
}
