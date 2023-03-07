"use strict"


let allStudnets = [];

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const listElement = document.getElementById("student-list");


const Student = {
firstname: "",
middlename: null,
nickName: null,
lastname: null,
gender:"",
house:"",
}

window.addEventListener("DOMContentLoaded", loadJSON);



async function loadJSON() {
    const response = await fetch(url);
    const jsonData = await response.json();

    // when loaded, prepare data objects
    prepareObjects(jsonData);
}




function prepareObjects(jsonData) {
    allStudnets = jsonData.map(prepareObject);



    console.table(allStudnets);

    // displayList();
}


 
function prepareObject(jsonObject) {
    const student = Object.create(Student);

    student.firstname = jsonObject.fullname;

    // const texts = jsonObject.fullname.split(" ");
    // animal.name = texts[0];
    // animal.desc = texts[2];
    // animal.type = texts[3];
    // animal.age = jsonObject.age;

    return student;
}


function trimName(){

student.firstname = jsonObject.trim; 

}



