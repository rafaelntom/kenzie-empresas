import { editDeptDescription, openDeleteDeptModal, openDeleteModal, openDepartamentModal, openDeptAllInfo, openEditProfileModal, openUserEditModal } from "./modal.js";
import {
  companyDepartaments,
  deptCoWorkers,
  getAllCompanies,
  getAllDepartaments,
  getAllUsers,
  getCompaniesBySector,
  getCompaniesSector,
  getUserInfo,
  verifyUserType,
} from "./requests.js";

// * ↓ Home Page functions ↓
// ? Function to get all the companies and then create a card for each one of them
export async function renderAllCompanies() {
  const companiesList = await getAllCompanies();

  companiesList.forEach((company) => {
    createCompanyCard(company);
  });
}

// ? Company card create template
export function createCompanyCard(company) {
  const ulCompanies = document.querySelector(".companies__card");

  // *------------- Creating Elements -------------
  const listCompany = document.createElement("li");
  const companyName = document.createElement("h3");
  const companyTime = document.createElement("span");
  const companySector = document.createElement("span");

  // *------------- Appending Elements -------------
  ulCompanies.appendChild(listCompany);
  listCompany.append(companyName, companyTime, companySector);

  // *------------- Setting Classes -------------
  companyTime.classList.add("open__time");
  companySector.classList.add("sector");

  // *------------- Setting Content -------------
  companyName.innerText = company.name;
  companyTime.innerText = company.opening_hours;
  companySector.innerText = company.sectors.description;
}

// ? Rendering the select and creating all the options (index.html)
export async function renderSelect() {
  const allSectors = await getCompaniesSector();
  const select = document.querySelector("#sectorType");

  allSectors.forEach((company) => {
    const newOption = document.createElement("option");

    newOption.value = company.description;
    newOption.innerText = company.description;

    select.append(newOption);
  });
}

// ? Fuction to render homepage cards based on the select value (index.html)
export async function filterRenderSelect() {
  const select = document.querySelector("#sectorType");
  const ulCompanies = document.querySelector(".companies__card");

  select.addEventListener("change", async (event) => {
    const selectedOption = event.target.value;

    if (selectedOption == "") {
      ulCompanies.innerHTML = "";
      await renderAllCompanies();
    } else {
      ulCompanies.innerHTML = "";

      const filteredCompanies = await getCompaniesBySector(selectedOption);

      filteredCompanies.forEach((company) => {
        createCompanyCard(company);
      });
    }
  });
}

// * ↓ Dashboard functions ↓
// ? Function to create user card
export function createUserCard(user) {
  const userContainer = document.querySelector(".user__container");
  // *------------- Creating Elements -------------
  const userName = document.createElement("h4");

  const userInfoDiv = document.createElement("div");
  const emailSpan = document.createElement("span");
  const userProfLevel = document.createElement("span");
  const userJobType = document.createElement("span");
  const editUserPencil = document.createElement('img')

  // *------------- Appending Elements -------------
  userContainer.append(userName, userInfoDiv, editUserPencil);
  userInfoDiv.append(emailSpan, userProfLevel, userJobType);

  // *------------- Setting Classes ------------
  userName.classList.add("username");
  userInfoDiv.classList.add("userInfo__container");
  userProfLevel.classList.add("professional__level");
  userJobType.classList.add("job__type");
  editUserPencil.classList.add("editUser__btn")

  // *------------- Setting Content -------------
  userName.innerText = user.username;
  emailSpan.innerText = "E-mail: " + user.email;
  userProfLevel.innerText = user.professional_level;
  editUserPencil.src = '../assets/pencil-icon-purple.png'
  editUserPencil.dataset.userId = user.uuid

  if (user.kind_of_work == null) {
    userJobType.innerText = "não definido";
  } else {
    userJobType.innerText = user.kind_of_work;
  }
}

// ? Function to retrieve user info and render it
export async function renderUserInfo() {
  const isUserAdm = await verifyUserType();
  const userContainer = document.querySelector('.user__container')

  if (isUserAdm.is_admin == true) {
    window.location.replace("../pages/admDashboard.html");
  } else {
    userContainer.innerHTML = ''
    const userInfo = await getUserInfo();
    createUserCard(userInfo);
  }
}

// ! ADMIN Dashboard functions
// *Function to create options for the select
export async function admCreateSelectDepts() {
  const admSelect = document.querySelector("#dept");
  const allDepartaments = await getAllDepartaments();
  // console.log(allDepartaments)

  allDepartaments.forEach((departament) => {
    // const newOption = document.createElement("option");
    // newOption.value =
    // newOption.innerText =
    // select.append(newOption);
  });
}

function createDepartamentsCard(departament) {
  const cardsUnorderedList = document.querySelector(".dept__card-wrapper");

  // *------------- Creating Elements -------------
  const cardList = document.createElement('li')

  const cardHeaderDiv = document.createElement('div')
  const deptName = document.createElement('h4')
  const deptDescription = document.createElement('span')
  const companyName = document.createElement('span')

  const iconsDiv = document.createElement('div')
  const eyeIcon = document.createElement('img')
  const pencilIcon = document.createElement('img')
  const trashIcon = document.createElement('img')

  // *------------- Appending Elements -------------
  cardsUnorderedList.appendChild(cardList)

  cardList.append(cardHeaderDiv, iconsDiv)
  cardHeaderDiv.append(deptName, deptDescription, companyName)
  iconsDiv.append(eyeIcon, pencilIcon, trashIcon)

  // *------------- Setting Classes ------------
  cardHeaderDiv.classList.add('dept__card-header')
  deptDescription.classList.add('dept__description')
  companyName.classList.add('company__name')

  iconsDiv.classList.add('dept__card-icons')
  eyeIcon.classList.add('seeDept__btn')
  pencilIcon.classList.add('editDept__btn')
  trashIcon.classList.add('deleteDept__btn')

  // *------------- Setting Content -------------
  deptName.innerText = departament.name
  deptDescription.innerText = departament.description
  companyName.innerText = departament.companies.name

  eyeIcon.src = '../assets/eye-icon.png'
  eyeIcon.dataset.deptId = departament.uuid
  pencilIcon.src = '../assets/pencil-icon-black.png'
  pencilIcon.dataset.deptId = departament.uuid
  trashIcon.src = '../assets/trash-icon-black.png'
  trashIcon.dataset.deptId = departament.uuid
}

export async function renderAllDepartaments () {
  const allDepartaments = await getAllDepartaments()

  const deptCardsUnorderedList = document.querySelector(".dept__card-wrapper");
  deptCardsUnorderedList.innerHTML = ''

  allDepartaments.forEach(departament => {
    createDepartamentsCard(departament)
  })

  await createOptionsSelect()
  editDeptDescription()
  openDeleteDeptModal()
  await openDeptAllInfo()

}

// * ↓ Functions to create users card and render all of them ↓
function createRegisterdUserCard(user) {
  const userUl = document.querySelector(".users__UL");

  // *------------- Creating Elements -------------
  const listUser = document.createElement("li");

  const userInfoDiv = document.createElement("div");
  const userName = document.createElement("h4");
  const userProfLevel = document.createElement("span");
  const userCompany = document.createElement("span");

  const userIconsDiv = document.createElement("div");
  const userEditPencil = document.createElement("img");
  const userTrash = document.createElement("img");

  // *------------- Appending Elements -------------
  userUl.appendChild(listUser);
  listUser.append(userInfoDiv, userIconsDiv);
  userInfoDiv.append(userName, userProfLevel, userCompany);
  userIconsDiv.append(userEditPencil, userTrash);

  // *------------- Setting Classes ------------
  userInfoDiv.classList.add("user__info");
  userProfLevel.classList.add("prof__level");
  userCompany.classList.add("company__name");

  userIconsDiv.classList.add("user__icons");
  userEditPencil.classList.add("editUser__btn");
  userTrash.classList.add("userTrash__btn");
  // *------------- Setting Content -------------

  userName.innerText = user.username;
  userProfLevel.innerText = user.professional_level;
  userCompany.innerText = "Sem Empresa";

  userEditPencil.src = "../assets/pencil-icon-purple.png";
  userEditPencil.dataset.userId = user.uuid;
  userTrash.src = "../assets/trash-icon-black.png";
  userTrash.dataset.userId = user.uuid;
}

export async function renderAllUsers() {
  const allusers = await getAllUsers();
  const userUl = document.querySelector(".users__UL");
  userUl.innerHTML = "";

  allusers.forEach((user) => {
    createRegisterdUserCard(user);
  });

  openUserEditModal()
  await openDeleteModal()
}

// * ↓ Rendering all the companies and creating options inside select
export async function deptSelectOptions() {
  const allCompanies = await getAllCompanies();
  const select = document.querySelector("#deptSelect");
  allCompanies.forEach((company) => {
    const newOption = document.createElement("option");

    newOption.value = company.uuid;
    newOption.innerText = company.name;

    select.append(newOption);
  });
}

// * ↓ Options for the SELECT departaments companies (adm dashboard)
export async function createOptionsSelect () {
  const allCompanies = await getAllCompanies();
  const select = document.querySelector("#dept");
  
  allCompanies.forEach((company) => {
    const newOption = document.createElement("option");

    newOption.value = company.uuid;
    newOption.innerText = company.name;

    select.append(newOption);
  });

}

export async function filterCompanyDept () {
  const select = document.querySelector('#dept')
  const cardsUnorderedList = document.querySelector(".dept__card-wrapper");

  select.addEventListener('change', async (event) => {
    const selectedOption = event.target.value
    const departments = await companyDepartaments(selectedOption)
    cardsUnorderedList.innerHTML = ''
    
    departments.forEach(element => {
      createDepartamentsCard(element)
    })
  
  })
}


export async function renderCoWorkers() {
  const coWorkers = await deptCoWorkers();
  const messageNoCoWorkers = document.querySelector(".not__hired");
  const hiredContainer = document.querySelector(".user__card");
  const companyHeader = document.querySelector('.companies__header')

  if (coWorkers.length < 1) {
    messageNoCoWorkers.classList.remove("hidden");
    messageNoCoWorkers.classList.add("show");
    companyHeader.classList.add("hidden")
    hiredContainer.innerHTML = "";
  } else {
    const allCoWorkers = coWorkers.map(element => element.users)
    allCoWorkers.forEach((item) => {
        item.forEach(user => {
            createCoWorkerCard(user)
        })
    })
  }
}

function createCoWorkerCard(user) {
  const hiredContainer = document.querySelector(".user__card");

  hiredContainer.insertAdjacentHTML('afterbegin', 
  `
    <li>
        <h5>${user.username}</h5>
        <span>${user.professional_level}</span>
    </li>

  `
  )
}

