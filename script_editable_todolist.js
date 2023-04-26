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

document.addEventListener("DOMContentLoaded", async function (event) {
  // console.log("Showing group members.");
  // await showGroupMembers();
  console.log("Showing items from database.");
  await getItemsFromDB();
  // showItemsInTable(itemsData);
});
//ping above------------------------------------------------------------