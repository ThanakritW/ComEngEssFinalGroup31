// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";
const frontendIPAddress = "127.0.0.1:5500";

const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

function setPage(link) {
  const content = document.querySelector('.main');
  fetch(link).then(res => res.text()).then(data => { content.innerHTML = data });
};

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
let student_id;
const getUserId = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  console.log("test1");
  await fetch(
    `http://${backendIPAddress}/courseville/get_user_id`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      try {
        student_id = data.data.student.id;
        console.log(data.data.student.id);
        console.log("test2");
        // document.getElementById(
        //   "user-id"
        // ).innerHTML = `${data.user.id}`;
      }
      catch (error) {
        console.error(error);
      }
    })
    .catch((error) => console.error(error));
};

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

  if (student_id === "") {
    console.log("No student_id ahhhh");
  }
  // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
  const items = itemsData.filter(item => item.student_id === student_id);
  items.sort((a, b) => (a.priority < b.priority) ? 1 : -1);
  // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
  items.map((item) => {
    // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
    let prior;
    let prior_2;
    switch (item.priority) {
      case 0:
        prior = "low";
        prior_2 = "Low";
        break;
      case 1:
        prior = "medium";
        prior_2 = "Medium";
        break;
      case 2:
        prior = "high";
        prior_2 = "High";
        break;
      default:
        prior = "completed";
        prior_2 = "Completed";
    }
    if (item.status == "No Status" || item.status == "") {
      no_status.innerHTML += `
        <div class="box" onclick="PopUpOnClick()">
          <h1 class="box-title hover-1">${item.title}</h1>
          <h2 class="box-title-2">${item.course_id}</h2>
          <div class="box-priority-${prior}">
            <h1>${prior_2}</h1>
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
          <div class="box-priority-${prior}">
            <h1>${prior_2}</h1>
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
          <div class="box-priority-${prior}">
            <h1>${prior_2}</h1>
          </div>
          <h1 class="box-date">📆 ${item.due_date}</h1>
        </div>
          `;
    }
    else if (item.status == "Completed") {
      prior = "completed";
      prior_2 = "Completed";
      com_pleted.innerHTML += `
        <div class="box" onclick="PopUpOnClick()">
          <h1 class="box-title hover-1">${item.title}</h1>
          <h2 class="box-title-2">${item.course_id}</h2>
          <div class="box-priority-${prior}">
            <h1>${prior_2}</h1>
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

const addItem = async () => {
  const course_id = document.getElementById("course-id-to-add").value;
  const status = document.getElementById("status-to-add").value;
  const priority = document.getElementById("priority-to-add").value;
  const description = document.getElementById("description-to-add").value;
  const due_date = document.getElementById("due-date-to-add").value;
  const title = document.getElementById("title-to-add").value;

  const itemToAdd = {
    course_id: course_id,
    status: status,
    priority: priority,
    description: description,
    due_date: due_date,
    title: title,
  }

  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(itemToAdd)
  }

  await fetch(`http://${backendIPAddress}/items`, options)
    .then((response) => {
      document.getElementById("course-id-to-add").value = 0;
      document.getElementById("status-to-add").value = 0;
      document.getElementById("priority-to-add").value = 0;
      document.getElementById("description-to-add").value = "";
      document.getElementById("due-date-to-add").value = "";
      document.getElementById("title-to-add").value = "";
    })
    .catch((error) => console.error(error));

  console.log("Showing items from database.");
  await getItemsFromDB();
  console.log(itemsData);
  showItemsInTable(itemsData);
}

const deleteItem = async (item_id) => {
  const options = {
    method: "DELETE",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items/` + item_id, options)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.error(error));

  console.log("Showing items from database.");
  await getItemsFromDB();
  showItemsInTable(itemsData);
};

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

document.addEventListener("DOMContentLoaded", async function (event) {
  // console.log("Showing group members.");
  // await showGroupMembers();
  console.log("Showing items from database.");
  await getItemsFromDB();
  console.log("Showing User Id");
  // await authorizeApplication();
  await getUserId();
  console.log(itemsData);
  showItemsInTable(itemsData);
});
//ping above------------------------------------------------------------