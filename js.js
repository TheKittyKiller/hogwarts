"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const Student = {
  firstname: "",
  middlename: "", // New property
  lastname: "",
  house: "",
  nicknames: []
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
      const middleName = capitalizeFirstLetter(fullNameParts.slice(1, -1).join(' '));
      const lastName = fullNameParts.length > 1 ? capitalizeFirstLetter(fullNameParts[fullNameParts.length - 1].replace(/["']/g, '')) : '';

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
  
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", handleSearch);
  
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
  headerRow.innerHTML = `<th onclick="sortData('firstname')">First Name</th><th onclick="sortData('lastname')">Last Name</th><th onclick="sortData('house')">House</th><th onclick="sortData('nicknames')">Nicknames</th><th>Image</th>`; // Add new column header for image
  tableHeader.appendChild(headerRow);
  tableElement.appendChild(tableHeader);



  const tableBody = document.createElement("tbody");
  students.forEach((student) => {
    const row = document.createElement("tr");
    const firstNameCell = document.createElement("td");
    const lastNameCell = document.createElement("td");
    const houseCell = document.createElement("td");
    const nicknamesCell = document.createElement("td");
    const imageCell = document.createElement("td"); // Create new cell for image

    firstNameCell.textContent = student.firstname;
    lastNameCell.textContent = student.lastname;
    houseCell.textContent = student.house;
    nicknamesCell.textContent = student.nicknames.join(", ");




  
    // Create and append the image element
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
    row.appendChild(nicknamesCell);
    row.appendChild(imageCell); // Add image cell to the row

//click event listner
  row.addEventListener("click", () => showStudentDetails(student));
    tableBody.appendChild(row);
  });

  tableElement.appendChild(tableBody);

  // Update the count information
  const houseCountElement = document.getElementById("house-count");
  const displayedCountElement = document.getElementById("displayed-count");
  const houseCounts = countStudentsByHouse(allStudents);
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

  // Create the student name element
  const name = document.createElement("h2");
  name.textContent = `${student.firstname} ${student.middlename} ${student.lastname}`; // Include middle name
  popupContent.appendChild(name);

  // Create the student house element
  const house = document.createElement("p");
  house.textContent = `House: ${student.house}`;
  popupContent.appendChild(house);

  // Create the student nicknames element
  const nicknames = document.createElement("p");
  nicknames.textContent = `Nicknames: ${student.nicknames.join(", ")}`;
  popupContent.appendChild(nicknames);

  // Append the pop-up content to the container
  popupContainer.appendChild(popupContent);

  // Append the pop-up container to the body
  document.body.appendChild(popupContainer);

  // Close the pop-up when clicking outside of it
  popupContainer.addEventListener("click", (event) => {
    if (event.target === popupContainer) {
      document.body.removeChild(popupContainer);
    }
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
    const counts = Object.entries(houseCounts).map(([house, count]) => `${house}: ${count}`);
    return counts.join(", ");
  }
  

fetchData();