"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const Student = {
  firstname: "",
  lastname: "",
  house: "",
};

let allStudents = [];
let filteredStudents = [];
let currentSort = {
  key: "",
  order: "asc",
};




async function fetchData() {
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    allStudents = jsonData.map((studentData) => {
      const student = Object.create(Student);
      student.firstname = capitalizeFirstLetter(studentData.fullname.trim().split(" ")[0]);
      student.lastname = capitalizeFirstLetter(studentData.fullname.trim().split(" ").slice(1).join(" ") || "");
      student.house = capitalizeFirstLetter(studentData.house.trim());
      return student;
    });
    filteredStudents = [...allStudents]; // Initially, set filtered students as all students
    displayData(filteredStudents);
  } catch (error) {
    console.error("An error occurred while fetching the data:", error);
  }
}

function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  return "";
}

function filterByHouse(house) {
  filteredStudents = allStudents.filter((student) => student.house === house);
  displayData(filteredStudents);
}

function sortData(key) {
  if (currentSort.key === key) {
    currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
  } else {
    currentSort.key = key;
    currentSort.order = "asc";
  }

  const sortedData = filteredStudents.sort((a, b) => {
    const valueA = a[key].toUpperCase();
    const valueB = b[key].toUpperCase();

    if (valueA < valueB) {
      return currentSort.order === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
      return currentSort.order === "asc" ? 1 : -1;
    }
    return 0;
  });

  displayData(sortedData);
}

function resetFilterAndSort() {
  filteredStudents = [...allStudents];
  currentSort.key = "";
  currentSort.order = "asc";
  displayData(filteredStudents);
}

function displayData(students) {
    const tableElement = document.getElementById("student-table");
    tableElement.innerHTML = ""; // Clear previous data
  
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th onclick="sortData('firstname')">First Name</th><th onclick="sortData('lastname')">Last Name</th><th onclick="sortData('house')">House</th>`;
    tableHeader.appendChild(headerRow);
    tableElement.appendChild(tableHeader);
  
    const tableBody = document.createElement("tbody");
    students.forEach((student) => {
      const row = document.createElement("tr");
      const firstNameCell = document.createElement("td");
      const lastNameCell = document.createElement("td");
      const houseCell = document.createElement("td");
  
      firstNameCell.textContent = student.firstname;
  
      if (student.nickname && student.nickname !== '""') {
        lastNameCell.textContent = "";
      } else {
        lastNameCell.textContent = student.lastname;
      }
  
      houseCell.textContent = student.house;
  
      row.appendChild(firstNameCell);
      row.appendChild(lastNameCell);
      row.appendChild(houseCell);
  
      tableBody.appendChild(row);
    });
  
    tableElement.appendChild(tableBody);
  }
  
  
  
  
  
  

fetchData();


