'use strict';

const userInfoContainer = document.getElementById('user-info-Container');
userInfoContainer.style.display = 'none';

document.getElementById('search-field').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const searchElement = document.getElementById('search-field');
        const userName = searchElement.value;
        searchElement.value = '';

        loadUser(userName);
        document.querySelector('.search-user').style.marginTop = '3.5rem';
        userInfoContainer.style.display = 'block';
    }
});

const loadUser = (userName) => {
    try {
        const url = `https://api.github.com/users/${userName}`;
        // console.log(url);

        fetch(url)
            .then((res) => res.json())
            .then((data) => displayUser(data));

        loadUserRepos(userName);
    } catch (err) {
        console.log(err.message);
    }
};

const loadUserRepos = (userName) => {
    const url = `https://api.github.com/users/${userName}/repos?sort=created`;

    //* use sort for selecting latest repositories
    // console.log(url);

    fetch(url)
        .then((res) => res.json())
        .then((data) => displayUserRepos(data));
};

const displayUserRepos = (repos) => {
    const reposElement = document.getElementById('repos');
    const latestFiveRepos = repos.slice(0, 5);

    latestFiveRepos.forEach((repo) => {
        const repoElement = document.createElement('a');
        repoElement.classList.add('repo');
        repoElement.href = repo.html_url;
        repoElement.innerText = repo.full_name;
        repoElement.target = '_blank';

        reposElement.appendChild(repoElement);
    });

    // console.log(latestFiveRepos);
    // console.log(repos);
};

const getDateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
};

const displayUser = (user) => {
    userInfoContainer.textContent = '';

    console.log(user);
    //* INFO: if no user found we get a message property
    const errorMessage = user.message ? user.message : ' ';

    if (errorMessage === 'Not Found') {
        const message = document.createElement('h2');
        message.innerHTML = `No profile with this username`;
        userInfoContainer.appendChild(message);
        return;
    } else {
        const userInfoDiv = document.createElement('div');
        userInfoDiv.innerHTML = `
      <div class="row">
            <div class="col-5">
                <img
                class="user-profile-picture"
                src="${user?.avatar_url}"
                alt=""
                />
            </div>
            <div class="col-7">
                <h4>${user?.name ? user.name : user.login}</h4>
                <a href="${user?.html_url
                }" target="_blank" class="user-profile-link " >${user?.login} </a>
                <p>Joined ${getDateFormat(user?.created_at)}</p>
            </div>
            </div>
            <div class="row py-4">
                <p>${user.bio ? user.bio : 'This profile has no bio'}</p>
            </div>

            <div class="row user-inner-info">
            <div class="col">
                <p>Repos</p>
                <h4>${user?.public_repos}</h4>
            </div>
            <div class="col">
                <p>Followers</p>
                <h4>${user.followers}</h4>
            </div>
            <div class="col">
                <p>Following</p>
                <h4>${user.following}</h4>
            </div>
            </div>

            <div class="row py-4 gy-3">
            <!-- item-1 -->
            <div class="col-sm-6  d-flex align-items-center gap-3">
                <img src="./images/icon-location.svg" alt="" />
                <a href="https://www.google.com/maps/place/${user.location
                } class="mt-1" target="_blank">${user?.location ? user?.location : 'Not Available'
                }</a>
            </div>
            <!-- item-2 -->
            <div class="col-sm-6 d-flex align-items-center gap-3">
                <img src="./images/icon-twitter.svg" alt="" />
                <a href="http://twitter.com/${user.twitter_username
                }" class="mt-1" target="_blank">${user?.twitter_username ? user?.twitter_username : 'Not Available'
                }</a>
            </div>

            <!-- item-3 -->
            <div class="col-sm-6 d-flex align-items-center gap-3">
                <img src="./images/icon-website.svg" alt="" />
                <a href="${user.blog}" class="mt-1" target="_blank">${user?.blog ? user.blog : 'Not available'
                }</a>
            </div>

            <!-- item-4 -->
            <div class="col-sm-6 d-flex align-items-center gap-3">
                <img src="./images/icon-company.svg" alt=""/>
                <a href="${user?.company}" class="mt-1" target="_blank">${user?.company ? user.company : 'Not Available'
                }</a>
            </div>

            <div id="repos" class="pt-2"> 

            </div>
    </div>
    `;

        userInfoContainer.appendChild(userInfoDiv);
    }
};