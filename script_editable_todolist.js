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

//ping below------------------------------------------------------------
let itemsData;
const CourseTitle = new Set();

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
      itemsData = data.filter(item => item.student_id === student_id);
      // console.log(itemsData)
    })
    .catch((error) => console.error(error));
};

const showItemsInTable = (itemsData) => {
  PopUpOnClick("No Status");
  PopDownOnClick();

  const no_status = document.getElementById("no-status");
  no_status.innerHTML = "";
  const next_up = document.getElementById("next-up");
  next_up.innerHTML = "";
  const in_progress = document.getElementById("in-progress");
  in_progress.innerHTML = "";
  const com_pleted = document.getElementById("com-pleted");
  com_pleted.innerHTML = "";
  const subjectLists = document.getElementById("title-to-add")
  subjectLists.innerHTML = "<option value='0'>Subject</option>";
  const priorityLists = document.getElementById("priority-to-add")
  priorityLists.innerHTML = "<option value='0'>Low</option>";

  if (student_id === "") {
    console.log("No student_id ahhhh");
  }
  // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
  const items = itemsData;
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
      case 3:
        prior = "completed";
        prior_2 = "Completed";
    }
    if (item.status == "No Status" || item.status == "") {
      createNewTask(no_status, item, prior, prior_2)
      // no_status.innerHTML += `
      //   <div class="box" onclick="PopUpOnClick()">
      //     <h1 class="box-title hover-1">${item.title}</h1>
      //     <h2 class="box-title-2">${item.course_id}</h2>
      //     <div class="box-priority-${prior}">
      //       <h1>${prior_2}</h1>
      //     </div>
      //     <h1 class="box-date">📆 ${item.due_date}</h1>
      //   </div>
      //     `;
    }
    else if (item.status == "Next Up") {
      createNewTask(next_up, item, prior, prior_2)
    }
    else if (item.status == "In Progress") {
      createNewTask(in_progress, item, prior, prior_2)
    }
    else if (item.status == "Completed") {
      createNewTask(com_pleted, item, prior, prior_2)
    }

    if (!(CourseTitle.has(item.title))) {
      CourseTitle.add(item.title);
      subjectLists.innerHTML += `<option value='${item.title}'>${item.title}</option>`;
    }

  // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
  });

  createAddTask(no_status, 0);
  // no_status.innerHTML += `
  //   <div class="box" onclick="PopUpOnClick()">
  //     <h1 class="box-add-new-list">Add new list</h1>
  //   <div class="box-add-new-list-2">⊕</div>
  //   </div>
  //     `;
  createAddTask(next_up, 1);
  createAddTask(in_progress, 2);
  createAddTask(com_pleted, 3);

  priorityLists.innerHTML += `<option value='1'>Medium</option>`;
  priorityLists.innerHTML += `<option value='2'>High</option>`;
  priorityLists.innerHTML += `<option value='3'>Completed</option>`;
};

const matchCourseTitletoId = (CourseTitle) => {
  const items = itemsData;
  items.map((item) => {
    if (item.title == CourseTitle) return item.course_id;
  });
}

const createNewTask = (status, item, prior, prior_2) => {
  status.innerHTML += `
  <div class="box" onclick="PopUpOnClick()">
    <h1 class="box-title hover-1">${item.title}</h1>
    <h2 class="box-title-2">${item.description}</h2>
    <div class="box-priority-${prior}">
      <h1>${prior_2}</h1>
    </div>
    <h1 class="box-date">📆 ${item.due_date}</h1>
    <button id="deleteTask" onclick="deleteItem('${item.item_id}')">
    Delete task
  </button>
  </div>
    `;
  }
  
const createAddTask = (status, status_i) => {
  switch (status_i) {
    case 0:
      prior = "No Status";
      break;
    case 1:
      prior = "Next Up";
      break;
    case 2:
      prior = "In Progress";
      break;
    default:
      prior = "Completed";
  }
  status.innerHTML += `
  <div class="box" onclick="PopUpOnClick('${prior}')">
    <h1 class="box-add-new-list">Add new list</h1>
  <div class="box-add-new-list-2">⊕</div>
  </div>
    `;
}

function PopUpOnClick(taskStatus) {
  insertInputBox.innerHTML = `
  <input
    type="text"
    id="new-title-to-add"
    name="new-title-to-add"
    placeholder="or add new subject"
  />
  `;
  insertButton.innerHTML = `
  <button id="addTask" onclick="addItem('${taskStatus}')">
    Add task
  </button>
  `;
  addNewTaskPopUp.classList.add("show");
}

function PopDownOnClick() {
  addNewTaskPopUp.classList.remove("show");
}

const addItem = async (taskStatus) => {
  const priority = parseInt(document.getElementById("priority-to-add").value);
  const description = document.getElementById("description-to-add").value;
  const due_date = document.getElementById("due-date-to-add").value;
  let title = document.getElementById("title-to-add").value;
  if (document.getElementById("new-title-to-add").value != '') {
    title = document.getElementById("new-title-to-add").value;
    document.getElementById("new-title-to-add").value = '';
  }
  const course_id = matchCourseTitletoId(title);
  const status = taskStatus;

  const itemToAdd = {
    course_id: course_id,
    status: status,
    priority: priority,
    description: description,
    due_date: due_date,
    title: title,
    student_id: student_id,
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
      // document.getElementById("course-id-to-add").value = 0;
      // document.getElementById("status-to-add").value = 0;
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
  console.log(itemsData);
};

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

document.addEventListener("DOMContentLoaded", async function (event) {
  // console.log("Showing group members.");
  // await showGroupMembers();
  console.log("Showing User Id");
  await getUserId();
  console.log("Showing items from database.");
  await getItemsFromDB();
  // await authorizeApplication();
  console.log(itemsData);
  showItemsInTable(itemsData);
});
//ping above------------------------------------------------------------