import { handleHamburguerMenu, handleUserLogin } from "./loginButtons.js";

handleHamburguerMenu()
handleUserLogin()

function authentication () {
    const token = localStorage.getItem('@kEmpresa:logintoken')

    if (token) {
        
        window.location.replace('../pages/dashboard.html')
    }

}
authentication()