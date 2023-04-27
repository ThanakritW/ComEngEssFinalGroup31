"use strict"
// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";
const frontendIPAddress = "127.0.0.1:5500";
const now = Math.floor(Date.now() / 1000);
const sevenDays = now + 604800;
const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

let allAssignments = [];
let courseInfo;

function getSensitive(duetime) {
  const today = now + 1440 * 60;
  if (duetime < today && duetime > now) {
    return "🔥 ";
  }
  return "";
}

function epochToDateTime(epoch) {
  const date = new Date(epoch * 1000); // multiply by 1000 to convert from seconds to milliseconds
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

async function setPage(link) {
  const content = document.querySelector('.main');
  fetch(link).then(res => res.text()).then(data => { content.innerHTML = data });
};

function getCourseTitle(cv_cid) {
  for (let i = 0; i < courseInfo.length; i++) {
    if (courseInfo[i].cv_cid == cv_cid) {
      return courseInfo[i].title;
    }
  }
}

// Example: Send Get user profile ("GET") request to backend server and show the response on the webpage
const getUserProfile = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/get_profile_info`,
    options
  )
    .then((response) =>
      response.json()
    )
    .then((data) => {
      try {
        document.getElementById(
          "eng-name-info"
        ).innerHTML = `${data.user.firstname_en} ${data.user.lastname_en}`;
        document.getElementById(
          "thai-name-info"
        ).innerHTML = `${data.user.firstname_th} ${data.user.lastname_th}`;
      }
      catch (error) {
        console.error(error);
      }
    })
    .catch((error) => {
      console.error(error);
      setPage('/login.html')
    }
    );
};

const getAssignments = async () => {
  console.log("fetching...");
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/get_courses`,
    options
  )
    .then((response) =>
      response.json()
    )
    .then((data) => data.data.student)
    .then((courseData) => courseInfo = courseData)
    .then(async (course) => {
      for (let i = 0; i < course.length; i++) {
        if (course[i].semester == 1) {
          continue;
        }
        const options = {
          method: "GET",
          credentials: "include",
        };
        await fetch(
          `http://${backendIPAddress}/courseville/get_course_assignments/${course[i].cv_cid}`,
          options
        )
          .then((response) =>
            response.json()
          )
          .then((data) => data.data)
          .then((assignment) => {
            for (let j = 0; j < assignment.length; j++) {

              assignment[j].cv_cid = course[i].cv_cid;
              // console.log(typeof assignment[j]);
              allAssignments.push(assignment[j]);
            }
          })
          .catch((error) => {
            console.error(error);
          }
          );
      }
    })
    .catch((error) => {
      console.error(error);
    }
    );
};

const drawAssignments = async () => {
  allAssignments = allAssignments.sort((a, b) => b.duetime - a.duetime);
  // allAssignments = allAssignments.sort((a, b) => parseInt(b.cv_cid) - parseInt(a.cv_cid));
  // console.log({ allAssignments, values: Object.values(allAssignments) })
  const assignedAssigment = [];
  const nearAssignment = [];
  const pastAssignment = [];
  console.log(now)
  console.log(sevenDays)
  for (const assignment of allAssignments) {
    if (assignment.duetime < now) {
      pastAssignment.push(assignment);
      continue
    }
    if (assignment.duetime < sevenDays) {
      nearAssignment.push(assignment);
      continue;
    }
    assignedAssigment.push(assignment);
  }
  console.log("COMPLETE");
  const assigned = document.getElementById("Assigned");
  const near = document.getElementById("Near");
  const past = document.getElementById("Past");
  assigned.innerHTML = '';
  near.innerHTML = '';
  past.innerHTML = '';
  assignedAssigment.map(async (data) => {
    // console.log(data)
    assigned.innerHTML += `
    <div class="box">
      <a href="https://www.mycourseville.com/?q=courseville/worksheet/${data.cv_cid}/${data.itemid}"><h1 class="box-title hover-1">${getSensitive(data.duetime)}${data.title}</h1></a>
      <br/>
      <h1 class="box-course">${getCourseTitle(data.cv_cid)}</h1>
      <h1 class="box-date">📆${epochToDateTime(data.duetime)}</h1>
    </div> 
    `
  })
  pastAssignment.map(async (data) => {
    // console.log(data)
    past.innerHTML += `
    <div class="box">
      <a href="https://www.mycourseville.com/?q=courseville/worksheet/${data.cv_cid}/${data.itemid}"><h1 class="box-title hover-1">${getSensitive(data.duetime)}${data.title}</h1></a>
      <br/>
      <h1 class="box-course">${getCourseTitle(data.cv_cid)}</h1>
      <h1 class="box-date">📆${epochToDateTime(data.duetime)}</h1>
    </div> 
    `
  })
  nearAssignment.map(async (data) => {
    // console.log(data)
    near.innerHTML += `
    <div class="box">
      <a href="https://www.mycourseville.com/?q=courseville/worksheet/${data.cv_cid}/${data.itemid}"><h1 class="box-title hover-1">${getSensitive(data.duetime)}${data.title}</h1></a>
      <br/>
      <h1 class="box-course">${getCourseTitle(data.cv_cid)}</h1>
      <h1 class="box-date">📆${epochToDateTime(data.duetime)}</h1>
    </div> 
    `
  })

}

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

document.addEventListener("DOMContentLoaded", async function (event) {
  await getUserProfile();
  await getAssignments();
  await drawAssignments(allAssignments);
});



{/* 
<div class="box">
  <h1 class="box-title hover-1">box name</h1>
  <div class="box-priority-high">
    <h1>High</h1>
  </div>
  <h1 class="box-date">📆yyyy/mm/dd 12:00PM </h1>
</div> 
*/}