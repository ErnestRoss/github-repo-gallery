/* Profile info */
const overview = document.querySelector(".overview");
const username = "ErnestRoss";
const list = document.querySelector(".repo-list");
const container = document.querySelector(".repos");
const repoExpanded = document.querySelector(".repo-data");
const viewReposBtn = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");


const getUserData = async function () {
    const resData = await fetch(`https://api.github.com/users/${username}`);
    const data = await resData.json();
    displayUserData(data);
};

getUserData();

const displayUserData = function (data){
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
        <figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
          </div>`;
    overview.append(div);
    getRepos();
};

const getRepos = async function () {
    const resRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await resRepos.json();
    displayRepos(repoData);
};

const displayRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        list.append(repoItem);
    }
};

list.addEventListener("click", function(e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

const getRepoInfo = async function(repoName) {
    const resRepoInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await resRepoInfo.json();
    const getLanguages = await fetch(repoInfo.languages_url);
    const languageData = await getLanguages.json();
    /* Create Language Array */
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function(repoInfo, languages) {
    repoExpanded.innerHTML = "";
    repoExpanded.classList.remove("hide");
    container.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoExpanded.append(div);
    viewReposBtn.classList.remove("hide");
};

viewReposBtn.addEventListener("click", function() {
    container.classList.remove("hide");
    repoData.classList.add("hide");
    viewReposBtn.classList.add("hide");
});

/* Dynamic search */
filterInput.addEventListener("input", function(e) {
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLowerText = searchText.toLowerCase();

    for (const repo of repos) {
        const repoLowerText = repo.innerText.toLowerCase();
        if (repoLowerText.includes(searchLowerText)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});