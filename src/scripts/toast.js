export function toast(text, color) {
    const toastContainer = document.querySelector('.toast__container')
    const toastMessage = document.querySelector('.toast__container > p')

    toastMessage.innerText = text
    
    toastContainer.style = `background-color: ${color}`
    toastContainer.classList.remove('hidden')
}