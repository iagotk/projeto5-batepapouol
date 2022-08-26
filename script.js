
/* nome do usuario */
let userName = {
    name: ""
}

let to = "Todos";
let type = "message";

let keepLoggedIn = (answer) => {
    if(document.querySelector(".start-screen").classList.contains("hidden")) {
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userName);
    }
}
/* procurando msgs */
function searchMessages () {
    if(document.querySelector(".start-screen").classList.contains("hidden")) {
        const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
        promise.then(printMessages); 
    }
}

let startChat = () => {
    document.querySelector(".start-screen").classList.add("hidden");
    document.querySelector(".chat").classList.remove("hidden");
    
    keepLoggedIn();
    searchMessages();
}

function signIn () {
    userName.name = document.querySelector(".user-name").value;

    document.querySelector(".start-screen > div").innerHTML = `
        <img src="./img/Loadin_icon.gif" alt="Loading">
        <h3>Entrando...</h3>
    `;
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userName);

    promise.then(startChat);
    promise.catch(handleError);
}



function handleError (error) {
    alert("Este nome ja existe! Escolha outro.");
    window.location.reload();
}

setInterval(keepLoggedIn, 5000);



     
 
