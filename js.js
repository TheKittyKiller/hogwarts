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
bloodType:""

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

    // console.table(allStudnets);

    // displayList();
}


 
function prepareObject(jsonObject) {
    const student = Object.create(Student);

    const fullname = jsonObject.fullname.trimStart().toLowerCase();




    const firstSpace = fullname.indexOf(" ");
    const secondSpace = fullname.indexOf(" ", firstSpace +1);
    const lastSpace = fullname.lastIndexOf(" ");
    
    
    const firstname = fullname.substring(0, firstSpace);
    const middlename = fullname.substring(firstSpace, secondSpace);
    const lastname = fullname.substring(lastSpace);
    


    console.log(fullname)


    // const texts = jsonObject.fullname.split(" ");

    // student.firstname = texts[0];
    // student.middlename = texts[1];
    // student.lastname = texts[2];

   // for the console table 
   // student.fullname =jsonObject.fullname;
   //     student.gender = jsonObject.gender;
   //     student.house = jsonObject.house;

   // animal.age = jsonObject.age;

    // trimName();
    return student;
}




function lowerCase (){




    Student.fullname = jsonObject.toLowerCase();
}






