import { userRegisterRequest } from "./requests.js";
import { toast } from "./toast.js";

const red = "#CE4646";
const green = "#4BA036";

export async function handeNewUserRegister() {
  const toastContainer = document.querySelector(".toast__container");
  const registerBtn = document.querySelector(".register__user");
  const registerBody = {};
  const inputsValues = document.querySelectorAll(".register__input");
  let counter = 0;

  registerBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    inputsValues.forEach(({ name, value }) => {
      if (value == "") {
        counter++;
      } else {
        registerBody[name] = value;
      }
    });

    if (counter !== 0) {
      toast("Por favor preencha todos os campos!", red);

      setTimeout(() => {
        toastContainer.classList.add("toast__fadeOut");
      }, 2400);

      setTimeout(() => {
        toastContainer.classList.add("hidden");
        toastContainer.classList.remove("toast__fadeOut");
      }, 3500);

      counter = 0;
    } else {
      await userRegisterRequest(registerBody)
    }
  });
}
