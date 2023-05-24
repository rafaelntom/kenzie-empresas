import { editDeptDescription, openDeleteModal, openDepartamentModal, openUserEditModal } from "./modal.js"
import { admCreateSelectDepts, filterCompanyDept, renderAllDepartaments, renderAllUsers } from "./render.js"
import { deleteUser, patchDeptDescription } from "./requests.js"

async function authentication () {
    const token = localStorage.getItem('@kEmpresa:logintoken')

    if (!token) {
        window.location.replace('../../index.html')
    }
}
authentication()

const userLogout = () => {
    const logoutBtn = document.querySelector('.admDashboard__logout')

    logoutBtn.addEventListener('click', () => {
        localStorage.clear()
        window.location.replace('../pages/login.html')
    })
}
userLogout()
openDepartamentModal()
await filterCompanyDept()
await admCreateSelectDepts()
await renderAllDepartaments()
await renderAllUsers()
