// * Functions to deal with the edit modal
import {
  deptSelectOptions,
  renderAllDepartaments,
  renderAllUsers,
  renderUserInfo,
} from "./render.js";
import {
  deleteUser,
  getAllUsers,
  patchUser,
  getUserInfo,
  patchNormalUser,
  createDepartament,
  getAllDepartaments,
  patchDeptDescription,
  deleteDepartment,
  outOfWorkUsers,
  hireUser,
  fireUser,
} from "./requests.js";
import { toast } from "./toast.js";

const red = "#CE4646";
const green = "#4BA036";

//  Function to create the edit user modal
function createUserEditModal(user) {
  const editModal = document.querySelector("#modal__controller");
  editModal.innerHTML = "";

  editModal.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="modal__container">
    <h4>Editar Perfil</h4>
    <img src="../assets/x-close-modal.png" alt="X">
    <form>
      <input type="text" class="update__input" name="username" placeholder="Seu nome" value="${user.username}">
      <input type="email" class="update__input" name="email" placeholder="Seu e-mail" value="${user.email}">
      <input type="password" class="update__input" name="password" placeholder="Sua senha">
      <button class="updateProfile__btn">Editar Perfil</button>
    </form>
  </div>
  `
  );
}

//  Function to open the edit modal on the pencil click (user page)
export async function openEditProfileModal() {
  const modalController = document.querySelector("#modal__controller");
  const editPencil = document.querySelector(".user__container > img");

  editPencil.addEventListener("click", async () => {
    const userInfo = await getUserInfo();
    createUserEditModal(userInfo);

    modalController.showModal();
    confirmPatchUser();
    closeEditProfileModal();
  });
}

//  Function to treat all the inputs on the edit modal (user page)
export function confirmPatchUser() {
  const toastContainer = document.querySelector(".toast__container");
  const editProfileBtn = document.querySelector(".updateProfile__btn");
  const inputValues = document.querySelectorAll(".update__input");
  const modalController = document.querySelector("#modal__controller");
  const updateProfileBody = {};
  let counter = 0;

  editProfileBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    inputValues.forEach(({ name, value }) => {
      if (value == "") {
        counter++;
      } else {
        updateProfileBody[name] = value;
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
      await patchNormalUser(updateProfileBody);
      modalController.close();
      await renderUserInfo();
      await openEditProfileModal();
    }
  });
}

//  Function to close the modal on X click (user page)
export function closeEditProfileModal() {
  const modalController = document.querySelector("#modal__controller");
  const closeBtn = document.querySelector(".modal__container > img");

  closeBtn.addEventListener("click", () => {
    modalController.close();
  });
}

// * Functions to deal with the DELETE USER modal (admin)
// ? Function to create the delete modal (admin page)
function createDeleteModal(user) {
  const deleteModal = document.querySelector("#deleteModal__controller");
  deleteModal.innerHTML = "";
  deleteModal.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="deleteModal__container">
      <img src="../assets/x-close-modal.png" alt="">
      <p>Realmente deseja remover o usuário ${user.username}</p>
      <button class="confirm__delete" data-user-id='${user.uuid}' >Deletar</button>
    </div>
    `
  );
}

// ? Function to close the delete modal (admin page)
function closeDeleteModal() {
  const deletePostModal = document.querySelector("#deleteModal__controller");
  const closeModalBtn = document.querySelector(".deleteModal__container > img");

  closeModalBtn.addEventListener("click", () => {
    deletePostModal.close();
  });
}

// ? Function to open the delete modal and render the user info (admin page)
export async function openDeleteModal() {
  const delteUserBtn = document.querySelectorAll(".userTrash__btn");
  const deletePostModal = document.querySelector("#deleteModal__controller");

  delteUserBtn.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const allUsers = await getAllUsers();
      const selectedUserId = event.target.dataset.userId;

      const foundUser = allUsers.find((user) => {
        return user.uuid == selectedUserId;
      });

      createDeleteModal(foundUser);
      deletePostModal.showModal();
      closeDeleteModal();
      await confirmDeleteUser();
    });
  });
}

// ? Function to confirm the 'DELETE' (admin page)
async function confirmDeleteUser() {
  const confirmDelteBtn = document.querySelector(".confirm__delete");
  const userId = confirmDelteBtn.dataset.userId;
  const deletePostModal = document.querySelector("#deleteModal__controller");

  confirmDelteBtn.addEventListener("click", async (event) => {
    await deleteUser(userId);
    await renderAllUsers();
    deletePostModal.close();

    closeDeleteModal();
  });
}

// * Function to deal with the edit user modal (admin)
// ? Create the edit modal
function createEditModal(user) {
  const editModal = document.querySelector("#editUserModal__controller");
  editModal.innerHTML = "";
  editModal.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="editUser__container">
            <img src="../assets/x-close-modal.png" alt="">
            <h4>Editar usuário: ${user.username}</h4>

            <select name="select__work" id="" class="editUser__input">
                <option value="" selected disabled>Selecionar modalidade de trabalho </option>
                <option value="home office" class="work__opt">home office</option>
                <option value="presencial" class="work__opt">presencial</option>
                <option value="hibrido" class="work__opt">híbrido</option>
            </select>

            <select name="rank" id="" class="useRank__input">
                <option value="" selected disabled>Selecionar nível profissional</option>
                <option value="estágio" class="rank__opt">estágio</option>
                <option value="júnior" class="rank__opt">júnior</option>
                <option value="pleno" class="rank__opt">pleno</option>
                <option value="sênior" class="rank__opt">sênior</option>
            </select>
            <button class="edit__user">Editar</button>
        </div>
    `
  );
}

// ? Open the edit (admin page)
export function openUserEditModal() {
  const pencilBtn = document.querySelectorAll(".editUser__btn");
  const editUserModal = document.querySelector("#editUserModal__controller");
  let patchUserBody = {};

  // Pencil click to open the edit modal
  pencilBtn.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const allUsers = await getAllUsers();
      const selectedUser = event.target.dataset.userId;
      const foundUser = allUsers.find((user) => {
        return user.uuid == selectedUser;
      });
      createEditModal(foundUser);

      editUserModal.showModal();

      // Clicking to confirm 'Edit' user info
      await confirmEditUser(selectedUser);
    });
  });
}

async function confirmEditUser(userId) {
  const confirmEditBtn = document.querySelector(".edit__user");
  const editUserModal = document.querySelector("#editUserModal__controller");

  confirmEditBtn.addEventListener("click", async (event) => {
    const newWorkValue = document.querySelector(".editUser__input").value;
    const newRankValue = document.querySelector(".useRank__input").value;

    let patchUserBody = {
      kind_of_work: newWorkValue,
      professional_level: newRankValue,
    };

    await patchUser(userId, patchUserBody);
    await renderAllUsers();
    editUserModal.close();
  });
}

// * ↓ Creating new departments ↓
function createDepartamentModal() {
  const departamentModal = document.querySelector(
    "#createDeptModal__controller"
  );
  departamentModal.innerHTML = "";

  departamentModal.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="createDept__container">
    <img src="../assets/x-close-modal.png" alt="">
    <h4>Criar departamento</h4>
    <input type="text" name="name" class="dept__input" placeholder="Nome do departamento">
    <input type="text" name="description" class="dept__input" placeholder="Descrição">

    <select name="company_uuid" id="deptSelect">
      <option value="" selected disabled>Selecionar empresa</option>
    </select>

    <button class="confirm__createDept">Criar departamento</button>
  </div>

  `
  );
}

export function openDepartamentModal() {
  const addDeptBtn = document.querySelector(".add__dept");
  const deptModal = document.querySelector("#createDeptModal__controller");

  addDeptBtn.addEventListener("click", (event) => {
    createDepartamentModal();
    deptModal.showModal();
    deptSelectOptions();
    confirmCreateDept();
    closeDeptModal();
  });
}

export function confirmCreateDept() {
  const confirmBtn = document.querySelector(".confirm__createDept");
  const select = document.querySelector("#deptSelect");
  const deptModal = document.querySelector("#createDeptModal__controller");
  let counter = 0;

  let deptBody = {
    company_uuid: "",
  };

  confirmBtn.addEventListener("click", async () => {
    const inputValues = document.querySelectorAll(".dept__input");

    inputValues.forEach(({ name, value }) => {
      deptBody[name] = value;
    });

    deptBody.company_uuid = select.value;
    await createDepartament(deptBody);
    deptModal.close();

    await renderAllDepartaments();
  });
}

function closeDeptModal() {
  const closeBtn = document.querySelector(".createDept__container > img");
  const departamentModal = document.querySelector(
    "#createDeptModal__controller"
  );

  closeBtn.addEventListener("click", () => {
    departamentModal.close();
  });
}

// * ↓ Editing existing departament info
function createEditDescModal(departament) {
  const editDeptModal = document.querySelector("#editDeptModal__controller");

  editDeptModal.innerHTML = "";
  editDeptModal.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="editDept__container">
    <img src="../assets/x-close-modal.png" alt="">
    <h4>Editar departamento</h4>
    <textarea name="description" id="" cols="30" rows="10">${departament.description}</textarea>
    <button class="deptNewDescription" data-dept-id="${departament.uuid}">Salvar Alterações</button>
  </div>
  
  `
  );
}

export function editDeptDescription() {
  const editDeptBtn = document.querySelectorAll(".editDept__btn");
  const editDeptModal = document.querySelector("#editDeptModal__controller");

  editDeptBtn.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const selectedDept = event.target.dataset.deptId;
      const allDepartaments = await getAllDepartaments();

      const foundDept = allDepartaments.find((departament) => {
        return departament.uuid == selectedDept;
      });

      createEditDescModal(foundDept);
      editDeptModal.showModal();
      confirmDeptNewDescription();
    });
  });
}

async function confirmDeptNewDescription() {
  const confirmBtn = document.querySelector(".deptNewDescription");

  const deptId = confirmBtn.dataset.deptId;
  const patchBody = {};

  const editDeptModal = document.querySelector("#editDeptModal__controller");

  confirmBtn.addEventListener("click", async () => {
    const textAreaValue = document.querySelector("textarea").value;
    patchBody.description = textAreaValue;

    await patchDeptDescription(patchBody, deptId);
    await renderAllDepartaments();
    editDeptModal.close();
  });
}

// * ↓ Deleting existing departament
function createDeleteDepetModal(departament) {
  const deleteDeptModal = document.querySelector(
    "#deleteDeptModal__controller"
  );

  deleteDeptModal.innerHTML = "";
  deleteDeptModal.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="deleteDept__container">
    <img src="../assets/x-close-modal.png" alt="">
    <p>Realmente deseja deletar o Departamento ${departament.name} e demitir seus funcionários?</p>
    <button class="confirmDeleteDept" data-dept-id="${departament.uuid}">Confirmar</button>
  </div>
  `
  );
}

export async function openDeleteDeptModal() {
  const deleteDeptBtns = document.querySelectorAll(".deleteDept__btn");
  const deleteDeptModal = document.querySelector(
    "#deleteDeptModal__controller"
  );

  deleteDeptBtns.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const selectedDept = event.target.dataset.deptId;
      const allDepartaments = await getAllDepartaments();

      const foundDept = allDepartaments.find((departament) => {
        return departament.uuid == selectedDept;
      });

      createDeleteDepetModal(foundDept);
      deleteDeptModal.showModal();
      confirmDeptDelete();
    });
  });
}

async function confirmDeptDelete() {
  const confirmDeptDeleteBtn = document.querySelector(".confirmDeleteDept");
  const deleteDeptModal = document.querySelector(
    "#deleteDeptModal__controller"
  );

  confirmDeptDeleteBtn.addEventListener("click", async (event) => {
    const deptId = confirmDeptDeleteBtn.dataset.deptId;

    await deleteDepartment(deptId);
    deleteDeptModal.close();
    await renderAllDepartaments();
  });
}

// * ↓ Visualizing selected department (ALL INFO)
function createDeptAllInfo(departament) {
  const deptAllInfoModal = document.querySelector(
    "#allDeptInfoModal__controller"
  );

  deptAllInfoModal.innerHTML = "";
  deptAllInfoModal.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="allDeptInfo__container">
    <img src="../assets/x-close-modal.png" alt="" class="closeMainModal">
    <h4>${departament.name} </h4>
      <div class="header__container">
        <div class="left__container">
          <h4>${departament.description} </h4>
          <span>${departament.companies.name} </span>
        </div>
        <div class="right__container">
          <select name="" id="outOfWorkUsers">
              <option value="">Selecionar Usuário</option>
          </select>
          <button class="confirm__hireUser" data-dept-id="${departament.uuid}">Contratar</button>
      </div>
      </div>
    <ul class="hired__users">
      
    </ul>
  </div>
  `
  );
}

export async function openDeptAllInfo() {
  const eyeIconBtn = document.querySelectorAll(".seeDept__btn");
  const deptAllInfoModal = document.querySelector(
    "#allDeptInfoModal__controller"
  );

  eyeIconBtn.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const selectedDept = event.target.dataset.deptId;
      const allDepartaments = await getAllDepartaments();

      const foundDept = allDepartaments.find((departament) => {
        return departament.uuid == selectedDept;
      });

      createDeptAllInfo(foundDept);
      deptAllInfoModal.showModal();

      await outOfWorkusersSelect();
      await renderHiredUsers();
      closeDeptInfoModal()
    });
  });
}

function closeDeptInfoModal () {
  const closeBtn = document.querySelector('.closeMainModal')
  const deptAllInfoModal = document.querySelector(
    "#allDeptInfoModal__controller"
  );

  closeBtn.addEventListener('click', () => {
    deptAllInfoModal.close()
  })
}

function confirmHireUser() {
  const confirmBtn = document.querySelector(".confirm__hireUser");
  let requestBody = {};
  const select = document.querySelector("#outOfWorkUsers");

  confirmBtn.addEventListener("click", async (event) => {
    requestBody.user_uuid = document.querySelector("#outOfWorkUsers").value;
    requestBody.department_uuid = confirmBtn.dataset.deptId;

    await hireUser(requestBody);
    await outOfWorkusersSelect();
    await renderHiredUsers();
  });
}

async function outOfWorkusersSelect() {
  const select = document.querySelector("#outOfWorkUsers");
  
  const usersNoJob = await outOfWorkUsers();
  select.innerHTML = "";
  usersNoJob.forEach((user) => {
    const newOption = document.createElement("option");

    newOption.value = user.uuid;
    newOption.innerText = user.username;

    select.append(newOption);
  });

  
}

function createHiredUserCard(user) {
  const hiredUsersList = document.querySelector(".hired__users");

  hiredUsersList.insertAdjacentHTML(
    "afterbegin",
    `
  <li class="user__card">
    <h4>${user.username} </h4>
    <span>${user.professional_level}</span>
    <span>Company Name</span>
    <button class="fire__user" data-user-id="${user.uuid}">Desligar</button>
  </li>

  `
  );
}

async function renderHiredUsers() {
  const deptId = document.querySelector(".confirm__hireUser").dataset.deptId;
  const hiredUsersList = document.querySelector(".hired__users");

  const users = await getAllUsers();
  const foundUsers = users.filter((user) => {
    return user.department_uuid == deptId;
  });

  hiredUsersList.innerHTML = "";
  foundUsers.forEach((user) => {
    createHiredUserCard(user);
  });

  await confirmFireUser();
  confirmHireUser();
}

async function confirmFireUser() {
  const fireUserBtns = document.querySelectorAll(".fire__user");
  const select = document.querySelector("#outOfWorkUsers");

  fireUserBtns.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.dataset.userId;
      await fireUser(userId);
      await renderHiredUsers();
      await outOfWorkusersSelect();
    });
  });
}
