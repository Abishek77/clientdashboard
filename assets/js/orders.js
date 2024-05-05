// dashboard.js

function getDbUserFromLocalStorage() {
    const dbUserJSON = localStorage.getItem('dbUser');
    if (dbUserJSON) {
        return JSON.parse(dbUserJSON);
    } else {
        return null;
    }
}

function createUserName(dbUser) {
    if (dbUser && dbUser.first_name && dbUser.last_name) {
        return `${dbUser.first_name} ${dbUser.last_name}`;
    } else {
        return 'User';
    }
}

function onPageLoad() {
    const dbUser = getDbUserFromLocalStorage();

    if (dbUser) {
        const userNameElement = document.getElementById('userName');

        if (userNameElement) {
            const userName = createUserName(dbUser);
            userNameElement.textContent = userName;
        }

    } else {
        window.location.href = 'sign-in.html';
        console.log('No user found');
    }
}

onPageLoad()
