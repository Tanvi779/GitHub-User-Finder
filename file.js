const getEl = id => document.getElementById(id);

function clearExistingAlert(container) {
  const existing = container.querySelector(".error");
  if (existing) existing.remove();
}

const showError = (msg, container) => {
  clearExistingAlert(container);  

  const alert = document.createElement('p');
  alert.classList.add("error");
  alert.textContent = msg;
  container.appendChild(alert);
};

const clearOutpt = () => {
  getEl("Avatar").src = "";
  getEl("Username").textContent = "";
  getEl("Name").textContent = "";
  getEl("Bio").textContent = "";
  getEl("repos").textContent = "";

  const link = getEl("profileLink");
  link.href = "";
  link.textContent = "";
};

getEl("find").addEventListener("click", () => {
  clearOutpt();

  const username = getEl("user").value.trim();
  const output = getEl("output");
  const container = document.querySelector(".search-section");
  const findBtn = getEl("find");

  clearExistingAlert(container);  

  findBtn.textContent = "Loading...";
  findBtn.disabled = true;

  if (!username) {
    showError("Please enter a username", container);
    output.hidden = true;
    findBtn.textContent = "Find";
    findBtn.disabled = false;
    return;
  }

  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then(data => {
      getEl("Avatar").src = data.avatar_url;
      getEl("Username").textContent = data.login;
      getEl("Name").textContent = data.name || "N/A";
      getEl("Bio").textContent = data.bio || "N/A";
      getEl("repos").textContent = data.public_repos;

      const profileLink = getEl("profileLink");
      profileLink.href = data.html_url;
      profileLink.textContent = "View GitHub Profile";

      output.hidden = false;
    })
    .catch(err => {
      showError(`${err.message}`, container);
      output.hidden = true;
    })
    .finally(() => {
      findBtn.textContent = "Find";
      findBtn.disabled = false;
    });
});
