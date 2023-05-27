"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const Student = {
    firstname: "",
    lastname: "",
    house: "",
    nicknames: [] // Add nicknames property
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
        const fullNameParts = studentData.fullname.trim().split(' ');
        const firstName = capitalizeFirstLetter(fullNameParts[0]);
        const lastName = fullNameParts.length > 1 ? capitalizeFirstLetter(fullNameParts[fullNameParts.length - 1].replace(/["']/g, '')) : '';
        const house = capitalizeFirstLetter(studentData.house.trim());
        student.firstname = firstName;
        student.lastname = lastName;
        student.house = house;
        student.nicknames = findNicknames(studentData.fullname);
        return student;
      });
      
         
    filteredStudents = [...allStudents]; // Initially, set filtered students as all students
    displayData(filteredStudents);
  } catch (error) {
    console.error("An error occurred while fetching the data:", error);
  }
}

function findNicknames(fullname) {
    const nameParts = fullname.trim().split('"');
    if (nameParts.length > 1) {
      const nicknames = nameParts.slice(1, -1).map(nickname => {
        const capitalizedNickname = capitalizeFirstLetter(nickname.trim());
        return capitalizedNickname;
      });
      return nicknames;
    }
    return []; // Empty array if no nicknames found
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
    headerRow.innerHTML = `<th onclick="sortData('firstname')">First Name</th><th onclick="sortData('lastname')">Last Name</th><th onclick="sortData('house')">House</th><th onclick="sortData('nicknames')">Nicknames</th>`; // Add new column header
    tableHeader.appendChild(headerRow);
    tableElement.appendChild(tableHeader);
  
    const tableBody = document.createElement("tbody");
    students.forEach((student) => {
      const row = document.createElement("tr");
      const firstNameCell = document.createElement("td");
      const lastNameCell = document.createElement("td");
      const houseCell = document.createElement("td");
      const nicknamesCell = document.createElement("td"); // Create new cell for nicknames
  
      firstNameCell.textContent = student.firstname;
      lastNameCell.textContent = student.lastname;
      houseCell.textContent = student.house;
      nicknamesCell.textContent = student.nicknames.join(", "); // Display nicknames as comma-separated string
  
      row.appendChild(firstNameCell);
      row.appendChild(lastNameCell);
      row.appendChild(houseCell);
      row.appendChild(nicknamesCell); // Add nicknames cell to the row
  
      tableBody.appendChild(row);
    });
  
    tableElement.appendChild(tableBody);
  }
  

fetchData();
