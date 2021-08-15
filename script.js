// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBWQd1996ucq9oMPVyimXSVQC4AC8n6Qc",
  authDomain: "test-proj-gda2.firebaseapp.com",
  projectId: "test-proj-gda2",
  storageBucket: "test-proj-gda2.appspot.com",
  messagingSenderId: "509295531857",
  appId: "1:509295531857:web:fb0899a0dccad6d032a570",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM
const registration = document.querySelector("#registration");
const modal = document.querySelector(".modal");
const modalCloseButton = document.querySelector("#close");
const prepareForm = () => {
  setTimeout(function () {
    if (form.getAttribute("dest") === "createAccout") {
      registration.classList.remove("show_hide");
    } else if (form.getAttribute("dest") === "userLogIn") {
      registration.classList.add("show_hide");
    }
  }, 100);
};

const showModal = () => {
  prepareForm();
  setTimeout(function () {
    modal.classList.remove("hidden");
  }, 100);
};

const closeModal = () => {
  setTimeout(function () {
    modal.classList.add("hidden");
    modal2.classList.add("hidden");
    modal3.classList.add("hidden");
  }, 300);
  form.reset();
  form2.reset();
};
const form = document.querySelector("#form");
const info = document.querySelector(".user_txt");
const modalInfo = document.querySelector("#modalInfo");
const description = document.querySelector("#description");
const articles = document.querySelector("#articles");
const headerBGC = document.querySelector(".modal-header");
const userTxt = document.querySelector(".user");
const nav = document.querySelector("nav");
const createArticle = document.querySelector("#CreateArticle");
const userInfo = document.querySelector("#UserInfo");
const photoInput = document.querySelector("#picture");
const profileImage = document.querySelector("#profileImage");

// Close modal by pressing Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    // closeModal(); // second verion
    document.querySelector(".close").click();
  }
});

// Modal2 + Modal3
const modal2 = document.querySelector(".modal2");
const modal3 = document.querySelector(".modal3");
const modalCloseButton2 = document.querySelector("#close2");
const modalCloseButton3 = document.querySelector("#close3");
const form2 = document.querySelector("#form2");
const showModal2 = () => modal2.classList.remove("hidden");
const showModal3 = () => modal3.classList.remove("hidden");
createArticle.addEventListener("click", showModal2);
userInfo.addEventListener("click", showModal3);
modalCloseButton2.addEventListener("click", closeModal);
modalCloseButton3.addEventListener("click", closeModal);

// Modal
document
  .querySelectorAll("[modal-trigger]")
  .forEach((link) => link.addEventListener("click", showModal));
modalCloseButton.addEventListener("click", closeModal);

const CreateAccount = () => {
  modalInfo.innerHTML = "Create Account - Registration Form ";
  form.setAttribute("dest", "createAccout");
  console.log("Dest atrr: ", form.getAttribute("dest"));
  headerBGC.style.backgroundColor = "red";
};
document
  .querySelector("#CreateAccount")
  .addEventListener("click", CreateAccount);

const LogIn = () => {
  modalInfo.innerHTML = "Log In";
  form.setAttribute("dest", "userLogIn");
  console.log("Dest atrr: ", form.getAttribute("dest"));
  headerBGC.style.backgroundColor = "green";
};
document.querySelector("#LogIn").addEventListener("click", LogIn);

// Get the currently Logged-In user
let UserModal3 = [];
firebase.auth().onAuthStateChanged(function (token) {
  if (token) {
    console.log(107, "User Logged In; Token: ", token);
    CreateArticle.classList.remove("show_hide");
    document.querySelector("#Log_Out").classList.remove("show_hide");
    document.querySelector("#LogIn").classList.add("show_hide");
    document.querySelector("#CreateAccount").classList.add("show_hide");
    info.innerHTML = "Authorized User";
    userTxt.style.color = "violet";
    description.classList.add("show_hide");
    articles.classList.remove("show_hide");
    nav.style.backgroundColor = "lightyellow";
    console.log(117, "Token uid:", token.uid);
    console.log(118, "User email:", token.email);
    RenderArticles();
    userInfo.classList.remove("show_hide");
    // Gathering info to modal3
    document.querySelector("#user-info-email").innerHTML = token.email;
    document.querySelector("#user-info-uid").innerHTML = token.uid;
    articlesNumber();
    // usersNumber();    // Disabled because of: Insufficient permissions
    document.querySelector(".articles-info").classList.remove("show_hide");
    document.querySelector(".users-info").classList.remove("show_hide");
    UserModal3[0] = token.uid;
    addInfoToModal3();
    getProfilePicture();
  } else {
    console.log(132, "User Logged Out; Token: ", token);
    description.classList.remove("show_hide");
    articles.classList.add("show_hide");
    nav.style.backgroundColor = "lightcyan";
    document.querySelector("#CreateAccount").classList.remove("show_hide");
    CreateArticle.classList.add("show_hide");
    userInfo.classList.add("show_hide");
    document.querySelector(".articles-info").classList.add("show_hide");
    document.querySelector(".users-info").classList.add("show_hide");
  }
});

// Form + Create Account (Registration Form ) + Auto LogOut
let UserDB = [];
document.querySelector("#form").addEventListener("submit", function (e) {
  e.preventDefault();
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  let name = document.querySelector("#name").value;
  let hometown = document.querySelector("#hometown").value;
  let Gender = document.getElementsByName("gender");
  for (i = 0; i < Gender.length; i++) {
    if (Gender[i].checked) {
      gender = Gender[i].value;
    }
  }
  if (form.getAttribute("dest") === "createAccout") {
    console.log(159, "Creating Account");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = {
          email: email,
          password: password,
        };
        console.log(168, userCredential);
        console.log(user);
        console.log(170, userCredential.user.uid);
        const UserUid = userCredential.user.uid;
        form.reset();
        modal.classList.add("hidden");
        document.querySelector("#Log_Out").classList.remove("show_hide");
        document.querySelector("#LogIn").classList.add("show_hide");
        document.querySelector("#CreateAccount").classList.add("show_hide");
        info.innerHTML = "Authorized User";
        userTxt.style.color = "violet";
        description.classList.add("show_hide");
        articles.classList.remove("show_hide");
        modalInfo.innerHTML = " ";
        console.log("User Crated Account");
        UserDB[0] = UserUid;
        UserDB[1] = name;
        UserDB[2] = hometown;
        UserDB[3] = gender;
        addUserToBD();
        addUserPicture();
        setTimeout(() => {
          AutoLog_Out();
        }, 500);
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);
        alert(error.message);
      });
  }
});

// Log_Out
const Log_Out = function () {
  if (confirm("Do you really want to log out?")) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log(210, "User Logged Out");
      });
    document.querySelector("#Log_Out").classList.add("show_hide");
    document.querySelector("#LogIn").classList.remove("show_hide");
    document.querySelector("#CreateAccount").classList.remove("show_hide");
    info.innerHTML = "Unauthorized User";
    userTxt.style.color = "white";
    description.classList.remove("show_hide");
    articles.classList.add("show_hide");
  }
};
document.querySelector("#Log_Out").addEventListener("click", Log_Out);

// Form + LogIn
document.querySelector("#form").addEventListener("submit", function (e) {
  e.preventDefault();
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  if (form.getAttribute("dest") === "userLogIn") {
    console.log(229, "LoggingIn");
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = {
          email: email,
          password: password,
        };
        console.log(userCredential);
        console.log(user);
        form.reset();
        modal.classList.add("hidden");
        document.querySelector("#Log_Out").classList.remove("show_hide");
        document.querySelector("#LogIn").classList.add("show_hide");
        document.querySelector("#CreateAccount").classList.add("show_hide");
        info.innerHTML = "Authorized User";
        userTxt.style.color = "violet";
        description.classList.add("show_hide");
        articles.classList.remove("show_hide");
        modalInfo.innerHTML = " ";
        console.log("User Logged In");
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);
        alert(error.message);
      });
  }
});

// List of articles for Logged In Users
const RenderArticles = function () {
  let articlesSelector = document.querySelector("#artitcleList");
  // console.log(265, articlesSelector.innerHTML);
  db.collection("articles").onSnapshot((querySnapshot) => {
    let toRead = [];
    querySnapshot.forEach((doc) => {
      toRead.push(doc.data());
      // console.log(270, doc.id); //id of the doc
      // console.log(271, doc.data);  // data of the cod
      return toRead;
    });
    console.log(274, toRead.length);
    console.log(275, toRead);
    articlesSelector.innerHTML = "";
    for (i = 0; i < toRead.length; i++) {
      let div = document.createElement("div");
      let h = document.createElement("h");
      h.setAttribute("class", "art-Title");
      let p = document.createElement("p");
      let a = document.createElement("a");
      h.innerHTML = toRead[i].title;
      p.innerHTML = toRead[i].content;
      a.innerHTML = "Read more...";
      a.href = toRead[i].url;
      a.setAttribute("target", "_blank");
      div.appendChild(h);
      div.appendChild(p);
      div.appendChild(a);
      articlesSelector.appendChild(div);
    }
    console.log(293, "Aricles are rendered");
  });
};

// Auto Log_Out (when creating an account)
const AutoLog_Out = function () {
  alert("You will be automatically logget out \n Please login in a moment ...");
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User Auto Logged Out");
    });
  document.querySelector("#Log_Out").classList.add("show_hide");
  document.querySelector("#LogIn").classList.remove("show_hide");
  document.querySelector("#CreateAccount").classList.remove("show_hide");
  info.innerHTML = "Unauthorized User";
  userTxt.style.color = "white";
  description.classList.remove("show_hide");
  articles.classList.add("show_hide");
};

// Adding an Article
document.querySelector("#form2").addEventListener("submit", function (e) {
  e.preventDefault();
  let title = document.querySelector("#title").value;
  let content = document.querySelector("#content").value;
  let url = document.querySelector("#url").value;
  db.collection("articles")
    .add({
      title: title,
      content: content,
      url: url,
    })
    .then(() => {
      console.log("Document successfully written!");
      form2.reset();
      modal2.classList.add("hidden");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
});

//Number of articles
const articlesNumber = () => {
  db.collection("articles").onSnapshot((querySnapshot) => {
    let articlesIds = [];
    querySnapshot.forEach((doc) => {
      articlesIds.push(doc.id);
      return articlesIds;
    });
    console.log(345, "Number of articles:", articlesIds.length);
    document.querySelector("#articles-number").innerHTML = articlesIds.length;
  });
};

//Number of users
const usersNumber = () => {
  db.collection("users").onSnapshot((querySnapshot) => {
    let usersIds = [];
    querySnapshot.forEach((doc) => {
      usersIds.push(doc.id);
      console.log(usersIds);
      return usersIds;
    });
    console.log(359, "Number of users:", usersIds.length);
    document.querySelector("#users-number").innerHTML = usersIds.length;
  });
};
// Number of users - Insufficient permissions
let usersNumberInfo = document.querySelector("#users-number").innerHTML;
console.log(365, usersNumberInfo);
if (document.querySelector("#users-number").innerHTML == "") {
  document.querySelector("#users-number").innerHTML =
    "Insufficient permissions";
  console.info(369, "Insufficient permissions");
}

// Adding User's additional info to the DB while creating the account
function addUserToBD() {
  id = UserDB[0];
  db.collection("users")
    .doc(id)
    .set({
      name: UserDB[1],
      hometown: UserDB[2],
      gender: UserDB[3],
    })
    .then(() => {
      console.log(383, "Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

// Adding User additional info to Modal3
function addInfoToModal3() {
  console.log(388, UserModal3[0]);
  let UserModal3UID = UserModal3[0];
  db.collection("users")
    .doc(UserModal3UID)
    .get()
    .then((doc) => {
      console.log(398, doc.data());
      document.querySelector("#user-info-name").innerHTML = doc.data().name;
      document.querySelector(
        "#user-info-hometown"
      ).innerHTML = doc.data().hometown;
      document.querySelector("#user-info-gender").innerHTML = doc.data().gender;
    })
    .catch((error) => {
      console.log(406, "Error getting document:", error);
    });
}

// Adding user's profile picture to Storage
let picture = {};
photoInput.addEventListener("change", () => {
  picture = photoInput.files[0];
});
function addUserPicture() {
  idPic = UserDB[0];
  console.log(417, idPic);
  firebase
    .storage()
    .ref("users/" + idPic + "/Profile.jpg")
    .put(picture);
}

//Adding user's profile picture to Modal3 (User Info)
function getProfilePicture() {
  idUserPic = UserModal3[0];
  console.log(427, idUserPic);
  firebase
    .storage()
    .ref("users/" + idUserPic + "/Profile.jpg")
    .getDownloadURL()
    .then((url) => {
      profileImage.src = url;
      console.log(434, url);
    });
}
