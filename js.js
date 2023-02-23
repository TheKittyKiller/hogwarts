"use strict"




const Url = "https://petlatkea.dk/2021/hogwarts/students.json";
const listElement = document.getElementById("student-list");

let firstName;
let middleName;
let lastName;
let houseName;
let genderOf;



fetch(Url)
  .then(response => response.json())
  .then(data => {
    data.forEach(student => {
      const listItem = document.createElement("li");
      listItem.textContent = student.fullname + " " + student.house + " " + student.gender;
      listElement.appendChild(listItem);
    });
  })
  .catch(error => console.log("ther was an error cathing the data fam:", error));






