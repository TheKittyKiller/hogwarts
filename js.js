// "use strict";

// let allStudents = [];

// const url = "https://petlatkea.dk/2021/hogwarts/students.json";
// const listElement = document.getElementById("student-list");

// const Student = {
//   firstname: "",
//   middlename: "",
//   nickName: "",
//   lastname: "",
//   gender: "",
//   house: "",
//   bloodType: "",
// };

// window.addEventListener("DOMContentLoaded", loadJSON);

// async function loadJSON() {
//   const response = await fetch(url);
//   const jsonData = await response.json();

//   prepareObjects(jsonData);
//   displayList();
// }

// function prepareObjects(jsonData) {
//   allStudents = jsonData.map(prepareObject);
// }

// function prepareObject(jsonObject) {
//   const student = Object.create(Student);

//   const fullname = jsonObject.fullname.trimStart().toLowerCase();
//   const texts = fullname.split(" ");

//   student.firstname = texts[0];
//   student.middlename = texts[1];
//   student.lastname = texts[2];
//   student.gender = jsonObject.gender;
//   student.house = jsonObject.house;

//   return student;
// }

// function displayList() {
//   listElement.innerHTML = "";

//   allStudents.forEach((student) => {
//     const listItem = document.createElement("li");
//     listItem.textContent = `${student.firstname}     ${student.middlename} - ${student.house} - ${student.gender}    `;
//     listElement.appendChild(listItem);
//   });
// }


"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  house: "",
};

let cleanedData = [];



async function cleanData() {
  try {
    const response = await fetch(url);
    const jsonData = await response.json();

    cleanedData = jsonData.map((studentData) => {
      const student = Object.create(Student);

      const fullname = studentData.fullname.trim();
      const names = fullname.split(" ");

      student.firstname = capitalizeFirstLetter(names.shift());
      student.lastname = capitalizeFirstLetter(names.pop());

      if (names.length > 0) {
        const potentialNickname = names.join(" ").replace(/"/g, "");
        if (!potentialNickname.includes("(") && !potentialNickname.includes(")")) {
          student.middlename = capitalizeFirstLetter(names.join(" "));
        } else {
          student.nickname = potentialNickname
            .replace("(", "")
            .replace(")", "")
            .toLowerCase();
        }
      }

      student.house = studentData.house.trim();

      return student;
    });

    displayData(cleanedData);
  } catch (error) {
    console.error("An error occurred while cleaning the data:", error);
  }
}



//captalsing names 
function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  return "";
}


//putting the list on html

function displayData(students) {
  const listElement = document.getElementById("student-list");
  listElement.innerHTML = ""; // Clear previous data

  students.forEach((student) => {
    const listItem = document.createElement("li");

    let fullName = `${student.firstname} ${student.middlename} ${student.lastname}`;
    if (student.nickname) {
      fullName += ` (${student.nickname})`;
    }

    listItem.textContent = fullName;
    listElement.appendChild(listItem);
  });
}


//sorting the data

function sortDataByFirstName() {
  cleanedData.sort((a, b) => a.firstname.localeCompare(b.firstname));
  displayData(cleanedData);
}

function sortDataByLastName() {
  cleanedData.sort((a, b) => a.lastname.localeCompare(b.lastname));
  displayData(cleanedData);
}

function sortDataByHouse() {
  cleanedData.sort((a, b) => a.house.localeCompare(b.house));
  displayData(cleanedData);
}

cleanData();
