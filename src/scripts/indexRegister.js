import { handleHamburguerMenu } from "./loginButtons.js"
import { handeNewUserRegister } from "./registerButtons.js"

function authentication () {
    const token = localStorage.getItem('@kEmpresa:logintoken')

    if (token) {
        window.location.replace('./pages/login.html')
    }
}
authentication()

handeNewUserRegister()
handleHamburguerMenu()