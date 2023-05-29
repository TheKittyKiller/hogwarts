"use strict";



const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  house: "",
  expelled: false,
  prefect: false, 
  squad: false,
  bloodStatus: "",
};


let allStudents = [];
let filteredStudents = [];
let currentSort = {
  key: "",
  order: "asc",
};

let expelledStudents = [];

const houses = {
  Gryffindor: 0,
  Hufflepuff: 0,
  Ravenclaw: 0,
  Slytherin: 0
};

let bloodStatusData = [];

let inquisitorialSquad = [];

let isHacked = false;

const bloodStatusOptions = ["Pure-blood", "Half-blood", "Muggle-born"];


async function fetchData() {
  try {
    const [studentsResponse, bloodStatusResponse] = await Promise.all([
      fetch(url),
      fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    ]);

    const studentsJson = await studentsResponse.json();
    const bloodStatusJson = await bloodStatusResponse.json();

    allStudents = studentsJson.map((studentData) => {
      const student = Object.create(Student);
      const fullNameParts = studentData.fullname.trim().split(" ");

      const firstName = capitalizeFirstLetter(fullNameParts[0]);
      const middleName = capitalizeFirstLetter(fullNameParts.slice(1, -1).join(" "));
      const lastName = fullNameParts.length > 1 ? capitalizeFirstLetter(fullNameParts[fullNameParts.length - 1].replace(/["']/g, "")) : "";

      const house = capitalizeFirstLetter(studentData.house.trim());
      student.firstname = firstName;
      student.middlename = middleName; // Assign middle name
      student.lastname = lastName;
      student.house = house;
      student.nicknames = findNicknames(studentData.fullname);
      return student;
    });

    filteredStudents = [...allStudents];
    displayData(filteredStudents);

    bloodStatusData = bloodStatusJson;

  } catch (error) {
    console.error("An error occurred while fetching the data fam:", error);
  }
}


const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", handleSearch);


function findNicknames(fullname) {
  const nameParts = fullname.trim().split('"');
  if (nameParts.length > 1) {
    const nicknames = nameParts.slice(1, -1).map((nickname) => {
      const capitalizedNickname = capitalizeFirstLetter(nickname.trim());
      return capitalizedNickname;
    });
    return nicknames;
  }
  return []; // Empty array if no nicknames found
}



function hackTheSystem() {
  if (isHacked) {
    console.log("The system has already been hacked.");
    return;
  }
  const sebastian = Object.create(Student);
  sebastian.firstname = "Sebastian";
  sebastian.lastname = "Melph";
  sebastian.house = "Gryffindor";
  sebastian.nicknames = [];

  const image = document.createElement("img");
  image.src = "images/seb.jpg";
  image.alt = "Sebastian Melph";
  image.classList.add("student-image");

  const row = document.createElement("tr");
  const firstNameCell = document.createElement("td");
  const lastNameCell = document.createElement("td");
  const houseCell = document.createElement("td");
  const nicknamesCell = document.createElement("td");
  const imageCell = document.createElement("td");

  firstNameCell.textContent = sebastian.firstname;
  lastNameCell.textContent = sebastian.lastname;
  houseCell.textContent = sebastian.house;
  nicknamesCell.textContent = sebastian.nicknames.join(", ");
  imageCell.appendChild(image);

  row.appendChild(firstNameCell);
  row.appendChild(lastNameCell);
  row.appendChild(houseCell);
  row.appendChild(nicknamesCell);
  row.appendChild(imageCell);

  const tableBody = document.querySelector("#student-table tbody");
  tableBody.appendChild(row);
  
  const bloodStatus = getRandomBloodStatus();
  sebastian.bloodStatus = bloodStatus;

  isHacked = true; // Set the flag to true after hacking the system
  console.log("Sebastian Melph has been injected into the list of students.");

}


function getRandomBloodStatus() {
  const randomIndex = Math.floor(Math.random() * bloodStatusOptions.length);
  return bloodStatusOptions[randomIndex];
}


function handleSearch() {
  const searchQuery = searchInput.value.toLowerCase().trim();
  filteredStudents = allStudents.filter((student) => {
    const fullName = student.firstname.toLowerCase() + " " + student.lastname.toLowerCase();
    return fullName.includes(searchQuery);
  });
  displayData(filteredStudents);
}

function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  return "";
}

function filterByHouse(house) {
  filteredStudents = allStudents.filter((student) => student.house === house && !student.expelled); // Exclude expelled students
  displayData(filteredStudents);
}


function sortData(key) {
  if (currentSort.key === key) {
    currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
  } else {
    currentSort.key = key;
    currentSort.order = "asc";
  }

  const sortedData = filteredStudents.filter((student) => !student.expelled) // Exclude expelled students
    .sort((a, b) => {
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

function filterByHouse(house) {
  filteredStudents = allStudents.filter((student) => student.house === house && !student.expelled); // Exclude expelled students
  displayData(filteredStudents);
}

function displayData(students) {
  const tableElement = document.getElementById("student-table");
  tableElement.innerHTML = ""; // Clear previous data

  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `<th onclick="sortData('firstname')">First Name</th><th onclick="sortData('lastname')">Last Name</th><th onclick="sortData('house')">House</th><th>Expel</th><th>Image</th>`; // Update column headers
  tableHeader.appendChild(headerRow);
  tableElement.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");
  students.forEach((student) => {
    const row = document.createElement("tr");
    const firstNameCell = document.createElement("td");
    const lastNameCell = document.createElement("td");
    const houseCell = document.createElement("td");
    const expelCell = document.createElement("td"); // Create new cell for expel
    const imageCell = document.createElement("td");

    firstNameCell.textContent = student.firstname;
    lastNameCell.textContent = student.lastname;
    houseCell.textContent = student.house;
    expelCell.innerHTML = `<button onclick="expelStudent('${student.firstname}', '${student.lastname}')">Expel</button>`; // Create expel button
    const image = document.createElement("img");
    let imageName;
    if (students.filter((s) => s.lastname === student.lastname).length > 1) {
      imageName = `${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
    } else {
      const lastNameParts = student.lastname.toLowerCase().split("-");
      if (lastNameParts.length > 1) {
        imageName = `${lastNameParts[lastNameParts.length - 1]}_${student.firstname.toLowerCase().charAt(0)}.png`;
      } else {
        imageName = `${student.lastname.toLowerCase()}_${student.firstname.toLowerCase().charAt(0)}.png`;
      }
    }
    image.src = `images/${imageName}`;
    image.alt = `${student.firstname} ${student.lastname}`;
    imageCell.appendChild(image);

    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(houseCell);
    row.appendChild(expelCell);
    row.appendChild(imageCell);

    row.addEventListener("click", () => showStudentDetails(student));
    tableBody.appendChild(row);
  });

  tableElement.appendChild(tableBody);

  // Update the count information
  const houseCountElement = document.getElementById("house-count");
  const displayedCountElement = document.getElementById("displayed-count");
  const houseCounts = countStudentsByHouse(allStudents.filter((student) => !student.expelled)); // Exclude expelled students
  const displayedCount = students.length;

  houseCountElement.textContent = `Number of students in each house: ${formatHouseCounts(houseCounts)}`;
  displayedCountElement.textContent = `Number of students currently displayed: ${displayedCount}`;
}




function showStudentDetails(student) {
  // Create a pop-up container
  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  // Create the pop-up content
  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  // Create the student image element
  const image = document.createElement("img");
  let imageName;
  if (filteredStudents.filter((s) => s.lastname === student.lastname).length > 1) {
    imageName = `${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
  } else {
    const lastNameParts = student.lastname.toLowerCase().split("-");
    if (lastNameParts.length > 1) {
      imageName = `${lastNameParts[lastNameParts.length - 1]}_${student.firstname.toLowerCase().charAt(0)}.png`;
    } else {
      imageName = `${student.lastname.toLowerCase()}_${student.firstname.toLowerCase().charAt(0)}.png`;
    }
  }
  image.src = `images/${imageName}`;
  image.alt = `${student.firstname} ${student.lastname}`;
  popupContent.appendChild(image);

  // Create the student information container
  const studentInfoContainer = document.createElement("div");
  studentInfoContainer.classList.add("student-info");

  // Create the student name element
  const nameElement = document.createElement("h2");
  nameElement.textContent = `${student.firstname} ${student.middlename} ${student.lastname}`; // Include middle name
  studentInfoContainer.appendChild(nameElement);

  // Create the student house element
  const houseElement = document.createElement("p");
  houseElement.textContent = `House: ${student.house}`;
  studentInfoContainer.appendChild(houseElement);

  // Create the expelled status element
  const expelledElement = document.createElement("p");
  expelledElement.textContent = `Expelled: ${student.expelled ? "Yes" : "No"}`;
  studentInfoContainer.appendChild(expelledElement);

// Create the prefect status element
const prefectElement = document.createElement("p");
prefectElement.textContent = `Prefect: ${student.prefect ? "Yes" : "No"}`; // Add prefect status
studentInfoContainer.appendChild(prefectElement);

// Create the blood status element
  const bloodStatusElement = document.createElement("p");
  const bloodStatus = getBloodStatus(student.lastname);
  bloodStatusElement.textContent = `Blood Status: ${bloodStatus}`;
  studentInfoContainer.appendChild(bloodStatusElement);

  // Create the squad status element
  const squadElement = document.createElement("p");
  squadElement.textContent = `Inquisitorial Squad: ${student.squad ? "Yes" : "No"}`;
  studentInfoContainer.appendChild(squadElement);

  // Create the squad toggle button
  const squadToggleButton = document.createElement("button");
  
  if ((student.bloodStatus === "pure-blood" || student.house === "Slytherin") && !student.expelled) {
    squadToggleButton.textContent = student.squad ? "Remove from Squad" : "Add to Squad";
    squadToggleButton.addEventListener("click", () => toggleSquadStatus(student));
  } else {
    squadToggleButton.textContent = "Ineligible for Squad";
    squadToggleButton.disabled = true;
  }

  studentInfoContainer.appendChild(squadToggleButton);



// Create the toggle prefect button
const prefectButton = document.createElement("button");
prefectButton.textContent = student.prefect ? "Remove Prefect" : "Make Prefect";
prefectButton.addEventListener("click", () => togglePrefectStatus(student)); // Add event listener
studentInfoContainer.appendChild(prefectButton);


  // Append the student information container to the pop-up content
  popupContent.appendChild(studentInfoContainer);

  // Append the pop-up content to the pop-up container
  popupContainer.appendChild(popupContent);

  // Append the pop-up container to the body
  document.body.appendChild(popupContainer);

  // Close the pop-up when clicked outside the content
  popupContainer.addEventListener("click", (event) => {
    if (!popupContent.contains(event.target)) {
      document.body.removeChild(popupContainer);
    }
  });
  
}

function togglePrefectStatus(student) {
  if (student.prefect) {
    student.prefect = false;
    houses[student.house]--;
  } else {
    // Check if there are already two prefects from the student's house
    if (houses[student.house] >= 2) {
      alert("There can only be two prefects from each house.");
      return;
    }
    student.prefect = true;
    houses[student.house]++;
  }

  const prefectButton = document.querySelector(".student-info button");
  if (student.prefect) {
    prefectButton.textContent = "Remove Prefect";
  } else {
    prefectButton.textContent = "Make Prefect";
  }

  displayPrefects(); // Update the prefect list
}


function toggleSquadStatus(student) {
  student.squad = !student.squad;

  if (student.squad) {
    inquisitorialSquad.push(student);
  } else {
    const index = inquisitorialSquad.findIndex((s) => s === student);
    if (index !== -1) {
      inquisitorialSquad.splice(index, 1);
    }
  }

  displaySquad(); // Update the squad list
}

// Function to display the Inquisitorial Squad list
function displaySquad() {
  const squadList = document.getElementById("inquisitorial-squad");
  squadList.innerHTML = ""; // Clear previous data

  inquisitorialSquad.forEach((student) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${student.firstname} ${student.lastname}`;
    squadList.appendChild(listItem);
  });
}

function getBloodStatus(lastname) {
  const pureBlood = bloodStatusData.pure;
  const halfBlood = bloodStatusData.half;

  if (pureBlood.includes(lastname)) {
    return "Pure Blood";
  } else if (halfBlood.includes(lastname)) {
    return "Half Blood";
  } else {
    return "muggle";
  }
}

function displayExpelledStudents() {
  const tableElement = document.getElementById("expelled-table");
  tableElement.innerHTML = ""; // Clear previous data

  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `<th>First Name</th><th>Last Name</th><th>House</th><th>Image</th>`; // Update column headers
  tableHeader.appendChild(headerRow);
  tableElement.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");
  expelledStudents.forEach((student) => {
    const row = document.createElement("tr");
    const firstNameCell = document.createElement("td");
    const lastNameCell = document.createElement("td");
    const houseCell = document.createElement("td");
    const imageCell = document.createElement("td");

    firstNameCell.textContent = student.firstname;
    lastNameCell.textContent = student.lastname;
    houseCell.textContent = student.house;
    const image = document.createElement("img");
    let imageName;
    if (expelledStudents.filter((s) => s.lastname === student.lastname).length > 1) {
      imageName = `${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
    } else {
      const lastNameParts = student.lastname.toLowerCase().split("-");
      if (lastNameParts.length > 1) {
        imageName = `${lastNameParts[lastNameParts.length - 1]}_${student.firstname.toLowerCase().charAt(0)}.png`;
      } else {
        imageName = `${student.lastname.toLowerCase()}_${student.firstname.toLowerCase().charAt(0)}.png`;
      }
    }
    image.src = `images/${imageName}`;
    image.alt = `${student.firstname} ${student.lastname}`;
    imageCell.appendChild(image);

    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(houseCell);
    row.appendChild(imageCell);

    row.addEventListener("click", () => showStudentDetails(student)); // Add event listener to show details
    tableBody.appendChild(row);
  });

  tableElement.appendChild(tableBody);
}


function expelStudent(firstName, lastName) {
  const studentIndex = filteredStudents.findIndex(
    (s) => s.firstname === firstName && s.lastname === lastName
  );

  if (studentIndex !== -1) {
    const expelledStudent = filteredStudents.splice(studentIndex, 1)[0];
    expelledStudent.expelled = true;
    expelledStudent.prefect = false; // Remove prefect status
    expelledStudents.push(expelledStudent);
    displayData(filteredStudents);
    displayExpelledStudents();
    removeRowEventListener(expelledStudent);
  }
}


function removeRowEventListener(student) {
  const tableRows = document.getElementsByTagName("tr");
  for (let i = 0; i < tableRows.length; i++) {
    const row = tableRows[i];
    const fullName = `${student.firstname} ${student.lastname}`;
    if (row.textContent.includes(fullName)) {
      row.removeEventListener("click", () => showStudentDetails(student));
      break;
    }
  }
}


function displayPrefects() {
  const prefectList = document.getElementById("prefect-list");
  prefectList.innerHTML = ""; // Clear previous data

  const prefects = filteredStudents.filter((student) => student.prefect);

  prefects.forEach((prefect) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${prefect.firstname} ${prefect.lastname}`;
    prefectList.appendChild(listItem);
  });
}


function countStudentsByHouse(students) {
  const houseCounts = {
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
  };

  students.forEach((student) => {
    houseCounts[student.house]++;
  });

  return houseCounts;
}

function formatHouseCounts(houseCounts) {
  return Object.entries(houseCounts)
    .map(([house, count]) => `${house}: ${count}`)
    .join(", ");
}

// Fetch data and display it

fetchData();
displayPrefects();
