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
      console.log("test");
      document.getElementById(
        "eng-name-info"
      ).innerHTML = `${data.user.firstname_en} ${data.user.lastname_en}`;
      document.getElementById(
        "thai-name-info"
      ).innerHTML = `${data.user.firstname_th} ${data.user.lastname_th}`;
    })
    .catch((error) => {
      console.error(error);
      setPage('/login.html')
    }
    );
};

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

