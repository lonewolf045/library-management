var firebaseConfig = {
  apiKey: "AIzaSyAY4pwMr8KLlmU_axcpOK6C84IuWpAdjDY",
  authDomain: "library-275b1.firebaseapp.com",
  databaseURL: "https://library-275b1.firebaseio.com",
  projectId: "library-275b1",
  storageBucket: "library-275b1.appspot.com",
  messagingSenderId: "1082532841039",
  appId: "1:1082532841039:web:d0af44b20c366cfd004c3a",
  measurementId: "G-81K1MYNJRK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let db = firebase.database();
let databaseData = "";
let myLibrary = [];
let myUsers = [];
let userRef = '';
let user;
let dataRef = db.ref().child('users');
let userDatabaseData = "";
let userDatabase = [];

dataRef.on("child_added", function (snapshot) {
  userDatabaseData = snapshot.val();
  //console.log(snapshot.val());
  userDatabase.push(userDatabaseData);
});
//console.log(userDatabase);

const btn = document.querySelector("#btn");
const btnLogin = document.querySelector("#btnLogin");
const btnSignUp = document.querySelector("#btnSignUp");
const container = document.querySelector("#container");
const btnLogout = document.querySelector("#logout-button");
const loginBtn = document.querySelector(".open-login-button");
const signUpBtn = document.querySelector(".open-signup-button");
const formBtn = document.querySelector(".open-button");

console.log(loginBtn);
console.log(signUpBtn);

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  /*this.info = function() {
    let marker;
    if(read) {
      marker = 'read';
    } else {
      marker = 'not read yet';
    }
    return `${title} by ${author}, ${pages} pages, ${marker}`;
  }*/
};

function User(fname,lname,username, password) {
  this.fname = fname;
  this.lname = lname;
  this.username = username;
  this.password = password;
}

Book.prototype.updateRead = function (index) {
  /*let marker;
    if(read) {
      marker = 'read';
    } else {
      marker = 'not read yet';
    }*/
  let currentStateRead = this.read;
  let arrayKeys = Object.keys(databaseData);
  let key = arrayKeys[index];
  let refUpdate = db.ref().child(user.username + "/books/" + key);
  if (currentStateRead == 'Read')
    this.read = 'Not Read';
  else
    this.read = 'Read';
  refUpdate.update({
    read: this.read
  });
}

Book.prototype.updateInfo = function (index,title,author,pages) {
  //console.log(index, title, author, pages);
  let arrayKeys = Object.keys(databaseData);
  let key = arrayKeys[index];
  let refUpdate = db.ref().child(user.username + "/books/" + key);
  this.title = title;
  this.author = author;
  this.pages = pages;
  //console.log(this.title,this.author,this.pages);
  //console.log(refUpdate);
  refUpdate.update({
    title: this.title,
    author: this.author,
    pages: this.pages
  });
}

Book.prototype.removeBook = function (index) {
  /*let i = new Number(index);
  myLibrary.splice(index,1);
  localStorage.setItem("MyLibrary", JSON.stringify(myLibrary));*/
  let arrayKeys = Object.keys(databaseData);
  let key = arrayKeys[index];
  let refRemove = db.ref().child(user.username + "/books/" + key);
  refRemove.remove();
}

const addBookToLibrary = function (title, author, pages, read) {
  let newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
  pushToDatabase(title, author, pages, read);
}

const loginUser = function (username, password) {
  let fname, lname;
  for (let i = 0; i < userDatabase.length; i++) {
    if (userDatabase[i].username == username) {
      fname = userDatabase[i].fname;
      lname = userDatabase[i].lname;
      break;
    }
  }
  user = new User(fname, lname, username, password);
  const use = document.querySelector(".welcome-message");
  use.innerHTML = "Welcome, " + fname + " " + lname;
  userRef = db.ref().child(username + "/books");
  console.log(userRef);

}

const signUpUser = function (fname, lname, username, password) {
  let newUser = new User(fname, lname, username, password);
  myUsers.push(newUser);
  pushUserToDataBase(fname, lname, username, password);
  /*const use = document.querySelector(".welcome-message");
  use.innerHTML = "Welcome, " + fname + " " + lname;
  userRef = db.ref().child(username + "/books");
  console.log(userRef);*/
  loginUser(username, password);
}

function openForm() {
  closeFormLogin();
  closeFormSignUp();
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  clearFormFields();
}

function openFormLogin() {
  closeForm();
  closeFormSignUp();
  document.getElementById("loginForm").style.display = "block";
}

function closeFormLogin() {
  document.getElementById("loginForm").style.display = "none";
  clearFormFieldsLogin();
}

function openFormSignUp() {
  closeForm();
  closeFormLogin();
  document.getElementById("signupForm").style.display = "block";
}

function closeFormSignUp() {
  document.getElementById("signupForm").style.display = "none";
  clearFormFieldsSignUp();
}

function openFormUpdate() {
  document.getElementById("updateForm").style.display = "block";
}

function closeFormUpdate() {
  document.getElementById("updateForm").style.display = "none";
  clearFormFieldsSignUp();
}

function clearFormFields() {
  document.forms["myForm"].reset();
}

function clearFormFieldsLogin() {
  document.forms["loginForm"].reset();
}

function clearFormFieldsSignUp() {
  document.forms["signupForm"].reset();
}

function clearFormFieldsUpdate() {
  document.forms["updateForm"].reset();
}

function pushToDatabase(title, author, pages, read) {
  //let reference = db.ref().child("books");
  let newReference = userRef.push();
  newReference.set({
    title: title,
    author: author,
    pages: pages,
    read: read
  });
}

function pushUserToDataBase(fname,lname,username, password) {
  let reference = db.ref().child("users");
  let newReference = reference.push();
  newReference.set({
    username: username,
    password: password,
    lname: lname,
    fname: fname
  });
}

function render() {
  container.innerHTML = "";
  //let databaseReference = db.ref().child("books");
  userRef.on("value", function (snapshot) {

    // Get all the values in the database
    databaseData = snapshot.val();

    let myLibrary = Object.values(databaseData);
    console.log(myLibrary);
    for (let i = 0; i < myLibrary.length; i++) {
      const bookCard = document.createElement("div");
      const bookTitle = document.createElement("div");
      const bookAuthor = document.createElement("div");
      const bookPages = document.createElement("div");

      const bookCardTools = document.createElement("div");
      const bookRead = document.createElement("button");
      const bookTrash = document.createElement("button");
      const bookUpdate = document.createElement("button");
      //const bookCheckMark = document.createElement("p");

      bookCard.classList.add("book-card");
      bookTitle.classList.add("book-detail");
      bookAuthor.classList.add("book-detail");
      bookPages.classList.add("book-detail");
      bookCardTools.classList.add("book-card-tools");
      if (myLibrary[i].read == 'Read')
        bookRead.classList.add('read');
      else
        bookRead.classList.add('not-read');
      bookTrash.classList.add("delete");
      bookUpdate.classList.add("update");

      bookRead.addEventListener('click', (e) => {
        Book.prototype.updateRead(bookCardTools.id);
        render();
      });

      bookTrash.addEventListener('click', (e) => {
        Book.prototype.removeBook(bookCardTools.id);
        render();
      });

      bookUpdate.addEventListener('click',(e) => {
        console.log("Clicked");
        let newTitle = document.forms["updateForm"]["title"];
        let newAuthor = document.forms["updateForm"]["author"];
        let newPages = document.forms["updateForm"]["pages"];
        newTitle.value = myLibrary[i].title;
        newAuthor.value = myLibrary[i].author;
        newPages.value = myLibrary[i].pages;
        console.log("Field Filled");
        openFormUpdate();
        console.log("form opened");
        let btnUpdate = document.getElementById('btnUpdate');
        btnUpdate.addEventListener('click',(e) => {
          console.log('Clicked');
          //console.log(newTitle.value,newAuthor.value,newPages.value);
          Book.prototype.updateInfo(bookCardTools.id,newTitle.value,newAuthor.value,newPages.value);
          render();
          console.log("Updated");
          closeFormUpdate();
        });
      });

      bookTitle.innerHTML = myLibrary[i].title;
      bookAuthor.innerHTML = myLibrary[i].author;
      bookPages.innerHTML = myLibrary[i].pages + " pages";
      bookCardTools.setAttribute('id', String(i));
      bookRead.innerHTML = myLibrary[i].read;
      bookTrash.innerHTML = 'Delete';
      bookUpdate.innerHTML = 'Update';

      bookCard.appendChild(bookTitle);
      bookCard.appendChild(bookAuthor);
      bookCard.appendChild(bookPages);

      bookCardTools.appendChild(bookRead);
      bookCardTools.appendChild(bookTrash);
      bookCardTools.appendChild(bookUpdate);

      bookCard.appendChild(bookCardTools);

      container.appendChild(bookCard);
    }

  });
}

btn.addEventListener("click", () => {
  console.log("Clicked");
  let newTitle = document.forms["myForm"]["title"];
  let newAuthor = document.forms["myForm"]["author"];
  let newPages = document.forms["myForm"]["pages"];
  let newRead = document.forms["myForm"]["read"];

  console.log("Extracted");
  addBookToLibrary(newTitle.value, newAuthor.value, newPages.value, newRead.value);
  render();
  closeForm();

});

btnLogin.addEventListener("click", () => {
  console.log("Clicked");
  let username = document.forms["loginForm"]["username"];
  let password = document.forms["loginForm"]["password"];
  let flag = 1;
  for (let i = 0; i < userDatabase.length; i++) {
    /*console.log(password.value);
    console.log(userDatabase[i].password);
    console.log(username.value);
    console.log(userDatabase[i].username);*/
    if (userDatabase[i].username == username.value) {
      if (userDatabase[i].password != password.value) {
        window.alert("Wrong Password");
        closeFormLogin();
        openFormLogin();
        return;
      } else {
        flag = 0;
      }
    }
  }

  if (flag === 1) {
    window.alert('Login Credentials Error');
    closeFormLogin();
    openFormLogin();
    return;
  }

  console.log("Logged In Phase I");
  loginUser(username.value, password.value);
  render();
  closeFormLogin();
  signUpBtn.style.display = "none";
  loginBtn.style.display = "none";
  btnLogout.style.display = "block";
  formBtn.style.display = "block";
});

btnSignUp.addEventListener("click", () => {
  console.log("Clicked");
  let fname = document.forms["signupForm"]["fname"];
  let lname = document.forms["signupForm"]["lname"];
  let username = document.forms["signupForm"]["username"];
  let password = document.forms["signupForm"]["password"];

  if (username.value == "") {
    window.alert("Enter the valid username");
    closeFormSignUp();
    openFormSignUp();
    return;
  }

  for (let i = 0; i < userDatabase.length; i++) {
    /*console.log(password.value);
    console.log(userDatabase[i].password);
    console.log(username.value);
    console.log(userDatabase[i].username);*/
    if (userDatabase[i].username == username.value) {
      window.alert("Username Exists");
      closeFormSignUp();
      openFormSignUp();
      return;
    }
  }

  if (password.value == "") {
    window.alert("Enter the valid password");
    closeFormSignUp();
    openFormSignUp();
    return;
  }

  console.log("Signed Up In Phase I");
  signUpUser(fname.value, lname.value, username.value, password.value);
  render();
  closeFormSignUp();
  signUpBtn.style.display = "none";
  loginBtn.style.display = "none";
  btnLogout.style.display = "block";
  formBtn.style.display = "block";
});

btnLogout.addEventListener("click", () => {
  console.log("Clicked");
  user = new User("", "");
  const use = document.querySelector(".welcome-message");
  use.innerHTML = "";
  container.innerHTML = "";
  console.log("Logged Out");
  signUpBtn.style.display = "block";
  loginBtn.style.display = "block";
  btnLogout.style.display = "none";
  formBtn.style.display = "none";
});