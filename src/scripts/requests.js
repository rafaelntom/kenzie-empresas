import { toast } from "./toast.js";

const baseUrl = "http://localhost:6278/";

const red = "#CE4646";
const green = "#4BA036";

const token = JSON.parse(localStorage.getItem("@kEmpresa:logintoken")) || "";

const requestHeader = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// ? Function to 'POST' login info into the API
export async function userLoginRequest(loginBody) {
  const toastContainer = document.querySelector(".toast__container");

  const token = await fetch(`${baseUrl}auth/login`, {
    method: "POST",
    headers: requestHeader,
    body: JSON.stringify(loginBody),
  }).then((response) => {
    if (response.ok) {
      response.json().then(async (responseOk) => {
        const userToken = localStorage.setItem(
          "@kEmpresa:logintoken",
          JSON.stringify(responseOk.token)
        );

        window.location.replace("../pages/dashboard.html");
        return userToken;
      });
    } else {
      response.json().then((responseError) => {
        toast("E-mail ou senha inválidos", red);
      });

      setTimeout(() => {
        toastContainer.classList.add("toast__fadeOut");
      }, 2400);

      setTimeout(() => {
        toastContainer.classList.add("hidden");
        toastContainer.classList.remove("toast__fadeOut");
      }, 3500);
    }
  });

  return token;
}

// ? Function to 'POST' register info into the API
export async function userRegisterRequest(registerBody) {
  const toastContainer = document.querySelector(".toast__container");

  const newUser = await fetch(`${baseUrl}auth/register`, {
    method: "POST",
    headers: requestHeader,
    body: JSON.stringify(registerBody),
  }).then((response) => {
    if (response.ok) {
      response.json().then((responseOk) => {
        toast(
          "Usuário cadastrado com sucesso, aguarde o redirecionamento para o login",
          green
        );

        setTimeout(() => {
          toastContainer.classList.add("toast__fadeOut");
        }, 2400);

        setTimeout(() => {
          toastContainer.classList.add("hidden");
          toastContainer.classList.remove("toast__fadeOut");
        }, 3500);

        setTimeout(() => {
          window.location.replace("../pages/login.html");
        }, 3900);
      });
    } else {
      response.json().then((responseError) => {
        toast(responseError.error, red);
      });

      setTimeout(() => {
        toastContainer.classList.add("toast__fadeOut");
      }, 2400);

      setTimeout(() => {
        toastContainer.classList.add("hidden");
        toastContainer.classList.remove("toast__fadeOut");
      }, 3500);
    }
  });
}

// ? Function to 'GET' all companies
export async function getAllCompanies() {
  const getAllCompanies = await fetch(`${baseUrl}companies`, {
    method: "GET",
    headers: requestHeader,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      alert("Ocorrou um erro na requisição para buscar todas as empresas!");
    }
  });

  return getAllCompanies;
}

// ? Function to 'GET' all companies sectors
export async function getCompaniesSector() {
  const allSectors = await fetch(`${baseUrl}sectors`, {
    method: "GET",
    headers: requestHeader,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });

  return allSectors;
}

// ? Function to 'GET' companies based on the sector
export async function getCompaniesBySector(sectorName) {
  const companies = await fetch(`${baseUrl}companies/${sectorName}`, {
    method: "GET",
    headers: requestHeader,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });

  return companies;
}

// ? Function to 'GET' user information
export async function getUserInfo() {
  const user = await fetch(`${baseUrl}users/profile`, {
    method: "GET",
    headers: requestHeader,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      response.json().then((responseError) => {
        console.log(responseError.error);
      });
    }
  });

  return user;
}

// ? Fuction to 'GET' user auth (admin or normal user)
export async function verifyUserType() {
  const userType = await fetch(`${baseUrl}auth/validate_user`, {
    method: "GET",
    headers: requestHeader,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      response.json().then((responseError) => responseError);
    }
  });
  return userType;
}

// ? Function to 'PATCH' normal user info
export async function patchNormalUser(patchUserBody) {
  const patchUser = await fetch(`${baseUrl}users`, {
    method: "PATCH",
    headers: requestHeader,
    body: JSON.stringify(patchUserBody),
  }).then((response) => response.json());
  return patchUser;
}

// ? Function to 'GET' all coworkers 
export async function deptCoWorkers () {
  const coWorkers = await fetch(`${baseUrl}users/departments/coworkers`,{
    method: 'GET',
    headers: requestHeader,
  }).then(response => {
    if(response.ok) { 
      return response.json()
    } else {
      console.log('something went wrong')
    }
  })
  return coWorkers
}
// ! Routes with AUTH needed
// ? Function to 'GET' all departaments (ADMIN)
export async function getAllDepartaments() {
  const departaments = await fetch(`${baseUrl}departments`, {
    method: "GET",
    headers: requestHeader,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      response.json().then((responseError) => responseError);
    }
  });
  return departaments;
}

// ? Function to 'GET' all users (ADMIN)
export async function getAllUsers() {
  const users = await fetch(`${baseUrl}users`, {
    method: "GET",
    headers: requestHeader,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      response.json().then((responseError) => responseError);
    }
  });
  return users;
}

// ? Function to 'DELTE' user
export async function deleteUser(userid) {
  const userToDelte = await fetch(`${baseUrl}admin/delete_user/${userid}`, {
    method: "DELETE",
    headers: requestHeader,
  }).then((response) => response);

  return userToDelte;
}

// ? Fuction to 'PATCH' user
export async function patchUser(patchUserId, patchUserBody) {
  const userToPatch = await fetch(
    `${baseUrl}admin/update_user/${patchUserId}`,
    {
      method: "PATCH",
      headers: requestHeader,
      body: JSON.stringify(patchUserBody),
    }
  ).then((response) => response);
}

// ? Fucntion to 'POST' new departament
export async function createDepartament(deptBody) {
  const deptToCreate = await fetch(`${baseUrl}departments`, {
    method: "POST",
    headers: requestHeader,
    body: JSON.stringify(deptBody),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      response.json().then((responseError) => {
        console.log(responseError.error);
      });
    }
  });
  return deptToCreate;
}

// ? Request to filter departaments by companies
export async function companyDepartaments(companyId) {
  const companyDepartaments = await fetch(
    `${baseUrl}departments/${companyId}`,
    {
      method: "GET",
      headers: requestHeader,
    }
  ).then((response) => response.json());

  return companyDepartaments;
}

// ? Request to 'PATCH' departament description
export async function patchDeptDescription(patchBody, departmentid) {
  const patchDept = await fetch(`${baseUrl}departments/${departmentid}`, {
    method: "PATCH",
    headers: requestHeader,
    body: JSON.stringify(patchBody),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("algum problema");
      return response.json();
    }
  });
}

// ? Request to 'DELETE' departament
export async function deleteDepartment(departmentid) {
  const deptDelete = await fetch(`${baseUrl}departments/${departmentid}`, {
    method: "DELETE",
    headers: requestHeader,
  }).then(response => response)
}

// ? Request to list all users that are out of work
export async function outOfWorkUsers () {
  const outOfWorkUsers = await fetch(`${baseUrl}admin/out_of_work`, {
    method: 'GET',
    headers: requestHeader
  }).then(response => {
    return response.json()
  })

  return outOfWorkUsers
}

// ? Request to hire an user
export async function hireUser (requestBody) {
  const userToHire = await fetch(`${baseUrl}departments/hire/`, {
    method: "PATCH",
    headers: requestHeader,
    body: JSON.stringify(requestBody)
  }).then(response => {
    if(response.ok) {
      return response.json()
    } else {
      console.log('something went wrong')
      return response.json()
    }
  })

  return userToHire
}

// ? Request to fire an user
export async function fireUser (userId) {
  const userToFire = await fetch(`${baseUrl}departments/dismiss/${userId}`, {
    method: 'PATCH',
    headers: requestHeader,
  }).then(response => {
    if(response.ok) {
      return response.json()
    } else {
      console.log('something went wrong')
    }
  })

  return userToFire
}