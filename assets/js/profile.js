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
        const clientName=document.getElementById('clientName');
        const storeName=document.getElementById('storeName');
        const clientAddress=document.getElementById('clientAddress');
        const clientDescription=document.getElementById('clientDescription');
        const fullName=document.getElementById('fullName');
        const phoneNo=document.getElementById('phoneNo');
        const clientEmail=document.getElementById('clientEmail')
        


        


            const userName = createUserName(dbUser);
            userNameElement.textContent = userName;

            clientName.textContent=userName
            storeName.textContent=dbUser.shop_name;
            clientAddress.textContent=dbUser.client_address;
            clientDescription.textContent=dbUser.client_description;
            fullName.textContent=userName;
            phoneNo.textContent=dbUser.client_phone;
            clientEmail.textContent=dbUser.email;
            

        

    } else {
        window.location.href = 'sign-in.html';
        console.log('No user found');
    }
}

onPageLoad()


