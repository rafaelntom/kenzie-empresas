import { userLoginRequest, verifyUserType } from "./requests.js"

export function handleHamburguerMenu () {
    const hamburguerBtn = document.querySelector('.hamburguer')
    const hamburguerNav = document.querySelector('.mobile__nav')

    hamburguerBtn.addEventListener('click', () => {
        hamburguerBtn.classList.toggle('is-active')
        hamburguerNav.classList.toggle('is-active')
    })
}

export async function handleUserLogin() {
    const loginBtn = document.querySelector('.userLogin__button')
    const inputValues = document.querySelectorAll('.login__input')
    const loginBody = {}

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault()

        inputValues.forEach(({name, value}) => {
            loginBody[name] = value
        })

        await userLoginRequest(loginBody)
    })
}