// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";
const frontendIPAddress = "127.0.0.1:5500";

let itemsData;

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
  const items = itemsData;
  const CourseTitle = new Set();
  items.sort((a, b) => (a.priority < b.priority) ? 1 : -1);
  items.map((item) => {
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
    }
    else if (item.status == "Next Up") {
      createNewTask(next_up, item, prior, prior_2)
    }
    else if (item.status == "In Progress") {
      createNewTask(in_progress, item, prior, prior_2)
    }
    else if (item.status == "Completed") {
      createNewTask(com_pleted, item, "completed", "Completed")
    }

    if (!(CourseTitle.has(item.title))) {
      CourseTitle.add(item.title);
      subjectLists.innerHTML += `<option value='${item.title}'>${item.title}</option>`;
    }

  });

  createAddTask(no_status, 0);
  createAddTask(next_up, 1);
  createAddTask(in_progress, 2);
  createAddTask(com_pleted, 3);

  priorityLists.innerHTML += `<option value='1'>Medium</option>`;
  priorityLists.innerHTML += `<option value='2'>High</option>`;
};

const createNewTask = (status, item, prior, prior_2) => {
  // console.log(item);
  status.innerHTML += `
  <div class="box" onclick="TaskDescPopUpOnClick('${item.realTitle}', '${item.title}', 
  ${item.priority}, '${item.due_date}', '${item.description}', '${item.item_id}')">
    <h1 class="box-real-title">${item.realTitle}</h1>
    <br/>
    <h1 class="box-title">${item.title}</h1>
    <div class="box-priority-${prior}">
      <h1>${prior_2}</h1>
    </div>
    <h1 class="box-date">📆 ${item.due_date}</h1>
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

function TaskDescPopUpOnClick(realtitle, title, priority_in, date_in, description_in, item_id_in) {
  // console.log(priority_in);
  let prior_t;
  let prior_t_2;
  switch (priority_in) {
    case 0:
      prior_t = "low";
      prior_t_2 = "Low";
      break;
    case 1:
      prior_t = "medium";
      prior_t_2 = "Medium";
      break;
    case 2:
      prior_t = "high";
      prior_t_2 = "High";
      break;
    default:
      prior_t = "completed";
      prior_t_2 = "Completed";
  }

  const realTitle = realtitle;
  const subject = title;
  const date = date_in;
  const description = description_in;
  const item_id = item_id_in;

  TaskDescScreen.innerHTML = `
  <h1 class="box-real-title" id="task-desc-title">${realTitle}</h1>
  <br />
  <h1 class="box-title" id="task-desc-subject">${subject}</h1>
  <div class="box-priority-${prior_t}">
      <h1>${prior_t_2}</h1>
  </div>
  <h1 class="box-date">📆 ${date}</h1>
  <h1 class="box-title-2">${description}</h1>
  <button id="editTask">Edit task</button>
  <button id="deleteTask" onclick="deleteItem(${item_id})">Delete task</button>
  <button id="closePopup" onclick="TaskDescPopDownOnClick()">Close</button>
  `;
  taskDescPopUp.classList.add("show");
}

function TaskDescPopDownOnClick() {
  taskDescPopUp.classList.remove("show");
}

const addItem = async (taskStatus) => {
  const priority = parseInt(document.getElementById("priority-to-add").value);
  const description = document.getElementById("description-to-add").value;
  const due_date = document.getElementById("due-date-to-add").value;
  const realTitle = document.getElementById("real-title-to-add").value;
  let title = document.getElementById("title-to-add").value;
  if (document.getElementById("new-title-to-add").value != '') {
    title = document.getElementById("new-title-to-add").value;
    document.getElementById("new-title-to-add").value = '';
  }
  const status = taskStatus;

  const itemToAdd = {
    // course_id: course_id,
    realTitle: realTitle,
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
      document.getElementById("due-date-to-add").value = "2023-01-01";
      document.getElementById("title-to-add").value = "";
      document.getElementById("real-title-to-add").value = "";
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

// susu kup p'muang :>
// const editItem = async (taskStatus, item_id) => {
//   let priority = parseInt(document.getElementById("priority-to-edit").value);
//   let description = document.getElementById("description-to-edit").value;
//   let due_date = document.getElementById("due-date-to-edit").value;
//   let realTitle = document.getElementById("real-title-to-edit").value;
//   let title = document.getElementById("title-to-edit").value;
//   let status = taskStatus;

//   if (document.getElementById("new-priority-to-edit").value != priority) {
//     priority = document.getElementById("new-priority-to-edit").value;
//     document.getElementById("new-priority-to-edit").value = 0;
//   }
//   if (document.getElementById("new-description-to-edit").value != '') {
//     description = document.getElementById("new-description-to-edit").value;
//     document.getElementById("new-description-to-edit").value = '';
//   }
//   if (document.getElementById("new-due-date-to-edit").value != '') {
//     due_date = document.getElementById("new-due-date-to-edit").value;
//     document.getElementById("new-due-date-to-edit").value = '';
//   }
//   if (document.getElementById("new-real-title-to-edit").value != '') {
//     realTitle = document.getElementById("new-real-title-to-edit").value;
//     document.getElementById("new-real-title-to-edit").value = '';
//   }
//   if (document.getElementById("new-title-to-edit").value != '') {
//     title = document.getElementById("new-title-to-edit").value;
//     document.getElementById("new-title-to-edit").value = '';
//   }
//   if (document.getElementById("new-status-to-edit").value != status) {
//     status = document.getElementById("new-status-to-edit").value;
//     document.getElementById("new-status-to-edit").value = '';
//   }

//   const itemToUpdate = {
//     realTitle: realTitle,
//     status: status,
//     priority: priority,
//     description: description,
//     due_date: due_date,
//     title: title,
//     student_id: student_id,
//   }

//   const options = {
//     method: "PUT",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(itemToUpdate)
//   }

//   await fetch(`http://${backendIPAddress}/items/` + item_id, options)
//     .then((response) => {
//       document.getElementById("priority-to-edit").value = 0;
//       document.getElementById("description-to-edit").value = "";
//       document.getElementById("due-date-to-edit").value = "";
//       document.getElementById("title-to-edit").value = "";
//       document.getElementById("real-title-to-edit").value = "";
//     })
//     .catch((error) => console.error(error));

//   console.log("Showing updated items from database.");
//   await getItemsFromDB();
//   console.log(itemsData);
//   showItemsInTable(itemsData);
// }

const initTodo = async () => {
  console.log("Showing User Id");
  await getUserId();
  console.log("Showing items from database.");
  await getItemsFromDB();
  console.log(itemsData);
  showItemsInTable(itemsData);
};