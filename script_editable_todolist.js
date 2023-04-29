// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";
const frontendIPAddress = "127.0.0.1:5500";

let itemsData;
let CourseTitle = new Set();
let student_id;

function getDateLabel() {
  const now = new Date();
  const dateString = now.toISOString().slice(0, 10);
  const hour = ('0' + now.getHours()).slice(-2);
  const minute = ('0' + now.getMinutes()).slice(-2);
  console.log(dateString + `T${hour}:${minute}`);
  document.getElementById("due-date-to-add").value = dateString + `T${hour}:12`;
}

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

function dateToString(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const getItemsFromDB = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items/`, options)
    .then((response) => response.json())
    .then((data) => {
      itemsData = data.filter(item => item.student_id === student_id);
    })
    .catch((error) => console.error(error));
};



// ---------------------SHOW TASKS IN TABLE----------------------------//

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
  const subjectLists = document.getElementById("title-to-add");
  subjectLists.innerHTML = "<option value=''>Subject</option>";
  const subjectLists_edit = document.getElementById("title-to-edit");
  subjectLists_edit.innerHTML = "<option value=''>Subject</option>";
  const priorityLists = document.getElementById("priority-to-add");
  priorityLists.innerHTML = "<option value='0'>Low</option>";
  const priorityLists_edit = document.getElementById("priority-to-edit");
  priorityLists_edit.innerHTML = "<option value='0'>Low</option>";

  if (student_id === "") {
    console.log("No student_id ahhhh");
  }
  const items = itemsData;
  CourseTitle = new Set();
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
      default:
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
      subjectLists_edit.innerHTML += `<option value='${item.title}'>${item.title}</option>`;
    }

  });

  createAddTask(no_status, 0);
  createAddTask(next_up, 1);
  createAddTask(in_progress, 2);
  createAddTask(com_pleted, 3);

  priorityLists.innerHTML += `<option value='1'>Medium</option>`;
  priorityLists.innerHTML += `<option value='2'>High</option>`;
  priorityLists_edit.innerHTML += `<option value='1'>Medium</option>`;
  priorityLists_edit.innerHTML += `<option value='2'>High</option>`;

  const statusList = document.getElementById("status-to-edit");
  statusList.innerHTML = `
  <option value='No Status'>No Status</option>
  <option value='Next Up'>Next Up</option>
  <option value='In Progress'>In Progress</option>
  <option value='Completed'>Completed</option>
  `;
  // statusList.innerHTML += `<option value='0'>No Status</option>`;
  // statusList.innerHTML += `<option value='1'>Next Up</option>`;
  // statusList.innerHTML += `<option value='2'>In Progress</option>`;
  // statusList.innerHTML += `<option value='3'>Completed</option>`;
};

const createNewTask = (status, item, prior, prior_2) => {
  status.innerHTML += `
  <div class="box" onclick="TaskDescPopUpOnClick('${item.realTitle}', '${item.title}', ${item.priority}, 
  '${item.due_date}', '${item.description}', '${item.item_id}', '${status}')">
    <h1 class="box-real-title">${item.realTitle}</h1>
    <br/>
    <h1 class="box-title">${item.title}</h1>
    <div class="box-priority-${prior}">
      <h1>${prior_2}</h1>
    </div>
    <div class="box-date">
      📆
      <h1>${dateToString(item.due_date)}</h1>
    </div>
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



// ---------------------POPUP RELATED----------------------------//

// add new task
function PopUpOnClick(taskStatus) {
  getDateLabel()
  insertInputBox.innerHTML = `
  <input
    type="text"
    id="new-title-to-add"
    name="new-title-to-add"
    placeholder="or add new subject"
  />
  `;
  insertButton.innerHTML = `
  <button class="add-task-button" id="addTask" onclick="addItem('${taskStatus}')">
    Add task
  </button>
  <button class="close-button" id="closePopup" onclick="PopDownOnClick()">Close</button>
  `;
  addNewTaskPopUp.classList.add("show");
}

function PopDownOnClick() {
  addNewTaskPopUp.classList.remove("show");
}


// task description
function TaskDescPopUpOnClick(realtitle, title, priority_in, date_in, description_in, item_id_in, status) {
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
  <div class="box-date">
    📆
    <input
    type="datetime-local"
    id="due-date-to-edit"
    name="due-date-to-edit"
    value="${date}"
    />
  </div>
  <h1 class="box-title-2">${description}</h1>
  <button id="editTask" onclick="preEdit('${realTitle}', '${subject}', ${priority_in}, 
  '${date}', '${description}', '${item_id}', '${status}')">Edit task</button>
  <button id="deleteTask" onclick="deleteItem('${item_id}')">Delete task</button>
  <button id="closePopup" onclick="TaskDescPopDownOnClick()">Close</button>
  `;
  taskDescPopUp.classList.add("show");
}

function TaskDescPopDownOnClick() {
  taskDescPopUp.classList.remove("show");
}


// task edit
function TaskEditPopUpOnClick() {
  TaskEditPopUp.classList.add("show");
}

function TaskEditPopDownOnClick() {
  TaskEditPopUp.classList.remove("show");
}



// ---------------------GET ADD DELETE EDIT----------------------------//

// add item
const addItem = async (taskStatus) => {
  let priority = parseInt(document.getElementById("priority-to-add").value);
  const description = document.getElementById("description-to-add").value;
  const due_date = document.getElementById("due-date-to-add").value;
  console.log(due_date);
  const realTitle = document.getElementById("real-title-to-add").value;
  let title = document.getElementById("title-to-add").value;
  if (document.getElementById("new-title-to-add").value != '') {
    title = document.getElementById("new-title-to-add").value;
    document.getElementById("new-title-to-add").value = '';
  }
  const status = taskStatus;

  if (realTitle === '') {
    alert("Please insert the task title");
    return
  }

  if (title === '') {
    alert("Please insert the task subject");
    return
  }

  if (status === "Completed") {
    priority = 3;
  }

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
      document.getElementById("due-date-to-add").value = "2023-01-01T23:59";
      document.getElementById("title-to-add").value = "";
      document.getElementById("real-title-to-add").value = "";
    })
    .catch((error) => console.error(error));

  console.log("Showing items from database.");
  await getItemsFromDB();
  console.log(itemsData);
  showItemsInTable(itemsData);
}

// delete item
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
  TaskDescPopDownOnClick();
};


// edit item
const preEdit = async (realtitle, title, priority_in, date_in, description_in, item_id_in, status) => {
  TaskDescPopDownOnClick();
  TaskEditPopUpOnClick();
  document.getElementById("real-title-to-edit").value = realtitle;
  document.getElementById("new-title-to-edit").value = title;
  document.getElementById("due-date-to-edit").value = date_in;
  document.getElementById("description-to-edit").value = description_in;


  document.getElementById("insertButton_edit").innerHTML = `
  <button id="confirmEdit" onclick="editItem('${realtitle}', '${title}', ${priority_in}, 
  '${date_in}', '${description_in}', '${item_id_in}', '${status}')">Confirm</button>
  <button id="closePopup" onclick="TaskEditPopDownOnClick()">Close</button>
  `;
}

const editItem = async (realtitle, title, priority_in, date_in, description_in, item_id_in, status) => {
  // let priority = parseInt(document.getElementById("priority-to-edit").value);
  // let description = document.getElementById("description-to-edit").value;
  // let due_date = document.getElementById("due-date-to-edit").value;
  // let realTitle = document.getElementById("real-title-to-edit").value;
  // let title = document.getElementById("title-to-edit").value;
  // let status = taskStatus;

  TaskEditPopDownOnClick();

  console.log(realtitle, title, priority_in, date_in, description_in, item_id_in, status)

  if (document.getElementById("status-to-edit").value != status) {
    status = document.getElementById("status-to-edit").value;
    document.getElementById("status-to-edit").value = 0;
  }
  if (document.getElementById("priority-to-edit").value != priority_in) {
    priority_in = parseInt(document.getElementById("priority-to-edit").value);
    document.getElementById("priority-to-edit").value = 0;
  }
  if (document.getElementById("description-to-edit").value != description_in) {
    description_in = document.getElementById("description-to-edit").value;
    document.getElementById("description-to-edit").value = '';
  }
  if (document.getElementById("due-date-to-edit").value != date_in) {
    date_in = document.getElementById("due-date-to-edit").value;
    document.getElementById("due-date-to-edit").value = "2023-01-01T23:59";
  }
  if (document.getElementById("real-title-to-edit").value != realtitle) {
    realtitle = document.getElementById("real-title-to-edit").value;
    document.getElementById("real-title-to-edit").value = '';
  }
  if (document.getElementById("new-title-to-edit").value != title) {
    title = document.getElementById("new-title-to-edit").value;
    document.getElementById("new-title-to-edit").value = '';
  }

  const itemToUpdate = {
    realTitle: realtitle,
    status: status,
    priority: priority_in,
    description: description_in,
    due_date: date_in,
    title: title,
    student_id: student_id,
  }

  const options = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(itemToUpdate)
  }

  await fetch(`http://${backendIPAddress}/items/` + item_id_in, options)
    .then((response) => {
      document.getElementById("priority-to-edit").value = 0;
      document.getElementById("description-to-edit").value = "";
      document.getElementById("due-date-to-edit").value = "2023-01-01T23:59";
      document.getElementById("title-to-edit").value = "";
      document.getElementById("real-title-to-edit").value = "";
    })
    .catch((error) => console.error(error));

  console.log("Showing updated items from database.");
  await getItemsFromDB();
  console.log(itemsData);
  showItemsInTable(itemsData);
}



// ---------------------Initialize----------------------------//

const initTodo = async () => {
  console.log("Showing User Id");
  await getUserId();
  console.log("Showing items from database.");
  await getItemsFromDB();
  console.log(itemsData);
  showItemsInTable(itemsData);
};