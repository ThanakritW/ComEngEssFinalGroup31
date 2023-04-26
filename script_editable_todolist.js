// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";
const frontendIPAddress = "127.0.0.1:5500";

// const authorizeApplication = () => {
//   window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
// };

// function setPage(link) {
//   const content = document.querySelector('.main');
//   fetch(link).then(res => res.text()).then(data => { content.innerHTML = data });
// };

// // Example: Send Get user profile ("GET") request to backend server and show the response on the webpage
// const getUserProfile = async () => {
//   const options = {
//     method: "GET",
//     credentials: "include",
//   };
//   await fetch(
//     `http://${backendIPAddress}/courseville/get_profile_info`,
//     options
//   )
//     .then((response) =>
//       response.json()
//     )
//     .then((data) => {
//       try {
//         document.getElementById(
//           "eng-name-info"
//         ).innerHTML = `${data.user.firstname_en} ${data.user.lastname_en}`;
//         document.getElementById(
//           "thai-name-info"
//         ).innerHTML = `${data.user.firstname_th} ${data.user.lastname_th}`;
//       }
//       catch (error) {
//         console.error(error);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       setPage('/login.html')
//     }
//     );
// };

// const getAssignments = async () => {
//   const options = {
//     method: "GET",
//     credentials: "include",
//   };
//   await fetch(
//     `http://${backendIPAddress}/courseville/get_courses`,
//     options
//   )
//     .then((response) =>
//       response.json()
//     )
//     .then((data) => data.data.student)
//     .then((course) => {
//       let allAssignments = []
//       for (let i = 0; i < course.length; i++) {
//         if (course[i].semester == 1) {
//           continue;
//         }
//         const options = {
//           method: "GET",
//           credentials: "include",
//         };
//         fetch(
//           `http://${backendIPAddress}/courseville/get_course_assignments/${course[i].cv_cid}`,
//           options
//         )
//           .then((response) =>
//             response.json()
//           )
//           .then((data) => data.data)
//           .then((assignment) => {
//             for (let j = 0; j < assignment.length; j++) {
//               assignment[j].cv_cid = course[i].cv_cid;
//               allAssignments.push(assignment[j]);
//             }
//           })
//           .catch((error) => {
//             console.error(error);
//           }
//           );
//       }
//       allAssignments = allAssignments.sort((a, b) => parseInt(b.duetime) - parseInt(a.duetime));
//       allAssignments = allAssignments.sort((a, b) => parseInt(b.cv_cid) - parseInt(a.cv_cid));
//       console.log(Date.now());
//     })
//     .catch((error) => {
//       console.error(error);
//     }
//     );
// };

// const logout = async () => {
//   window.location.href = `http://${backendIPAddress}/courseville/logout`;
// };

// pop up

function PopUpOnClick() {
  myPopup.classList.add("show");
}
function PopDownOnClick() {
  myPopup.classList.remove("show");
}

//ping below------------------------------------------------------------
let itemsData;

// const authorizeApplication = () => {
//   window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
// };

// function setPage(link) {
//   const content = document.querySelector('.main');
//   fetch(link).then(res => res.text()).then(data => { content.innerHTML = data });
// };

// // Example: Send Get user profile ("GET") request to backend server and show the response on the webpage
// const getUserProfile = async () => {
//   const options = {
//     method: "GET",
//     credentials: "include",
//   };
//   await fetch(
//     `http://${backendIPAddress}/courseville/get_profile_info`,
//     options
//   )
//     .then((response) =>
//       response.json()
//     )
//     .then((data) => {
//       try {
//         document.getElementById(
//           "eng-name-info"
//         ).innerHTML = `${data.user.firstname_en} ${data.user.lastname_en}`;
//         document.getElementById(
//           "thai-name-info"
//         ).innerHTML = `${data.user.firstname_th} ${data.user.lastname_th}`;
//       }
//       catch (error) {
//         console.error(error);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       setPage('/login.html')
//     }
//     );
// };

const getItemsFromDB = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items/`, options)
    .then((response) => response.json())
    .then((data) => {
      itemsData = data;
    })
    .catch((error) => console.error(error));
};

const showItemsInTable = (itemsData) => {
  const no_status = document.getElementById("no-status");
  no_status.innerHTML = "";
  const next_up = document.getElementById("next-up");
  next_up.innerHTML = "";
  const in_progress = document.getElementById("in-progress");
  in_progress.innerHTML = "";
  const com_pleted = document.getElementById("com-pleted");
  com_pleted.innerHTML = "";
  // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
  const items = itemsData;
  items.sort((a, b) => (a.priority < b.priority) ? 1 : -1);
  // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
  itemsData.map((item) => {
    // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
    let priority;
    let priority_2;
    switch (item.priority) {
      case 1:
        priority = "low";
        priority_2 = "Low";
        break;
      case 2:
        priority = "medium";
        priority_2 = "Medium";
        break;
      case 3:
        priority = "high";
        priority_2 = "High";
        break;
      default:
        priority = "completed";
        priority_2 = "Completed";
    }
    if (item.status == "No Status" || item.status == "") {
      no_status.innerHTML += `
        <div class="box" onclick="PopUpOnClick()">
          <h1 class="box-title hover-1">${item.title}</h1>
          <h2 class="box-title-2">${item.course_id}</h2>
          <div class="box-priority-${priority}">
            <h1>${priority_2}</h1>
          </div>
          <h1 class="box-date">📆 ${item.due_date}</h1>
        </div>
          `;
    }
    else if (item.status == "Next Up") {
      next_up.innerHTML += `
        <div class="box" onclick="PopUpOnClick()">
          <h1 class="box-title hover-1">${item.title}</h1>
          <h2 class="box-title-2">${item.course_id}</h2>
          <div class="box-priority-${priority}">
            <h1>${priority_2}</h1>
          </div>
          <h1 class="box-date">📆 ${item.due_date}</h1>
        </div>
          `;
    }
    else if (item.status == "In Progress") {
      next_up.innerHTML += `
        <div class="box" onclick="PopUpOnClick()">
          <h1 class="box-title hover-1">${item.title}</h1>
          <h2 class="box-title-2">${item.course_id}</h2>
          <div class="box-priority-${priority}">
            <h1>${priority_2}</h1>
          </div>
          <h1 class="box-date">📆 ${item.due_date}</h1>
        </div>
          `;
    }
    else if (item.status == "Completed") {
      priority = "completed";
      priority_2 = "Completed";
      com_pleted.innerHTML += `
        <div class="box" onclick="PopUpOnClick()">
          <h1 class="box-title hover-1">${item.title}</h1>
          <h2 class="box-title-2">${item.course_id}</h2>
          <div class="box-priority-${priority}">
            <h1>${priority_2}</h1>
          </div>
          <h1 class="box-date">📆 ${item.due_date}</h1>
        </div>
          `;
    }
    // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
  });
  no_status.innerHTML += `
    <div class="box" onclick="PopUpOnClick()">
      <h1 class="box-add-new-list">Add new list</h1>
    <div class="box-add-new-list-2">⊕</div>
    </div>
      `;
  next_up.innerHTML += `
    <div class="box" onclick="PopUpOnClick()">
      <h1 class="box-add-new-list">Add new list</h1>
    <div class="box-add-new-list-2">⊕</div>
    </div>
      `;
  in_progress.innerHTML += `
    <div class="box" onclick="PopUpOnClick()">
      <h1 class="box-add-new-list">Add new list</h1>
    <div class="box-add-new-list-2">⊕</div>
    </div>
      `;
  com_pleted.innerHTML += `
    <div class="box" onclick="PopUpOnClick()">
      <h1 class="box-add-new-list">Add new list</h1>
    <div class="box-add-new-list-2">⊕</div>
    </div>
      `;
};

document.addEventListener("DOMContentLoaded", async function (event) {
  // console.log("Showing group members.");
  // await showGroupMembers();
  console.log("Showing items from database.");
  await getItemsFromDB();
  console.log(itemsData);
  showItemsInTable(itemsData);
});
//ping above------------------------------------------------------------