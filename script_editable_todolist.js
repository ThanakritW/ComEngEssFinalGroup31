// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";
const frontendIPAddress = "127.0.0.1:5500";

function PopUpOnClick() {
  myPopup.classList.add("show");
}
function PopDownOnClick() {
  myPopup.classList.remove("show");
}

//ping below------------------------------------------------------------
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
      console.log(data);
      itemsData = data.filter(item => item.student_id === student_id);
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

const initTodo = async () => {
  console.log("Showing User Id");
  await getUserId();
  console.log("Showing items from database.");
  await getItemsFromDB();
  console.log(itemsData);
  showItemsInTable(itemsData);
};
//ping above------------------------------------------------------------