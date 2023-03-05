// const BACKEND_URL =
// "http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/";
const BACKEND_URL =
  "http://django-env-v1.eba-cveq8rvb.us-west-2.elasticbeanstalk.com/api/";

async function CheckUserPermissions() {
  var token = localStorage.getItem("token");

  await fetch(BACKEND_URL + "auth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.status)
    .catch((error) => {
      alert(error);
      return null;
    });
}

export { BACKEND_URL, CheckUserPermissions };
