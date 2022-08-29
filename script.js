
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

/* até aqui é pra entrar no bate papo */
function printMessages (answer) {
    let msg = [];
    msg = answer.data;

    let content = document.querySelector(".msg-box");
    
    content.innerHTML = "";

    for(let i = 0 ; i < msg.length ; i++) {
        if(msg[i].type === "status"){
            content.innerHTML += `
                <div class="${msg[i].type}">
                    <span class="time">(${msg[i].time})</span>
                    <span class="text"><strong>${msg[i].from}</strong> ${msg[i].text}
                </div>
                `;
        }
        
        if(msg[i].type === "message"){
            content.innerHTML += `
                <div class="${msg[i].type}">
                    <span class="time">(${msg[i].time})</span>
                    <span class="text"><strong>${msg[i].from}</strong> para <strong>${msg[i].to}</strong>: ${msg[i].text}
                </div>
                `;
        }

        if(msg[i].type === "private_message" && (msg[i].to === userName.name || msg[i].from === userName.name)){
            content.innerHTML += `
                <div class="${msg[i].type}">
                    <span class="time">(${msg[i].time})</span>
                    <span class="text"><strong>${msg[i].from}</strong> reservadamente para <strong>${msg[i].to}</strong>: ${msg[i].text}
                </div>
                `;
        }
    }
    
    let lastMessage = document.querySelector(".msg-box").lastElementChild;
    lastMessage.scrollIntoView();

}

setInterval(searchMessages, 3000);

let onSend = () => {
    searchMessages();

    document.querySelector(".type-here").value = "";
}

function sendMessage () {
    const text = document.querySelector(".type-here").value;
    const msg = {
        from: userName.name,
        to: to,
        text: text,
        type: type
    };

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);

    promise.then(onSend);
    promise.catch(window.location.reload);
}

document.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        let button;
        if(document.querySelector(".start-screen").classList.contains("hidden")) {
            button = document.querySelector(".btn");
        }

        if(document.querySelector(".chat").classList.contains("hidden")) {
            button = document.querySelector(".enter");
        }
        button.click();
    }
 });

 /* até aqui carrega/envia msgs, e envia com enter */
     
 function printParticipants (answer){
    let users = [];
    users = answer.data;

    let list = document.querySelector(".participants-list");
    
    list.innerHTML += "";

    for(let i = 0 ; i < users.length ; i ++) {
        if(users[i].name === to) {
            list.innerHTML += `
                <div>
                    <ion-icon name="person-circle"></ion-icon>
                    <p onclick="setTo(this)">${users[i].name}</p>
                    <ion-icon class="checked" name="checkmark-sharp"></ion-icon>
                </div>
            `;
        }   else {
                list.innerHTML += `
                    <div>
                        <ion-icon name="person-circle"></ion-icon>
                        <p onclick="setTo(this)">${users[i].name}</p>
                    </div>
                `;
            }
    }
 }

 function showParticipants () {
    document.body.innerHTML += `
        <div class="cover" onclick="closeSidebar()"></div>
     `;
    
    document.body.innerHTML += `
        <div class="participants-bar">
            <h5>Escolha um contato para enviar mensagem:</h5>

            <div class="participants-list">
                <div>
                    <ion-icon name="people"></ion-icon>
                    <p class="all" onclick="setTo(this)">Todos</p>
                </div>
            </div>

            <h5>Escolha a visibilidade:</h5>

            <div class="visibility-options">
                <div>
                    <ion-icon name="lock-open"></ion-icon>
                    <p class="public" data-identifier="visibility" onclick="setType(this)">Público</p>
                </div>

                <div>
                    <ion-icon name="lock-closed"></ion-icon>
                    <p class="private" data-identifier="visibility" onclick="setType(this)">Reservadamente</p>
                </div>
            </div>
        </div>
     `;

    let visibility;
    if(type === "message") {
        visibility = document.querySelector(".public");
     }

     if(type === "private_message") {
        visibility = document.querySelector(".private");
     }

     checkElement(visibility, "");

     if(to === "Todos") {
         let all = document.querySelector(".all");
         checkElement(all, "to");
     }
     
     checkParticipants();

}

let checkParticipants = () => {
    if(document.querySelector(".participants-bar") != undefined) {
        const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
        promise.then(printParticipants);
    }
}
   

let setTo = element => {
    to = element.innerText;

    checkElement(element, "to");

    if(type === "private_message") {
        document.querySelector(".send-info").innerHTML = `Enviando para ${to} (reservadamente)`;
    }   else {
            document.querySelector(".send-info").innerHTML = `Enviando para ${to}`;
    } 
}

let setType = element => {
    if(element.innerText === "Reservadamente") {
        type = "private_message";
    } else {
        type = "message";
    }

    checkElement(element, "type");

    if(type === "private_message") {
        document.querySelector(".send-info").innerHTML = `Enviando para ${to} (reservadamente)`;
    }   else {
        document.querySelector(".send-info").innerHTML = `Enviando para ${to}`;
    }
}

let closeSidebar = () => {
    let node = document.querySelector(".cover");
    node.parentNode.removeChild(node);
    
    node = document.querySelector(".participants-bar");
    node.parentNode.removeChild(node);
} 

let checkElement = (element, sort) => {
    if(sort === "type") {
        const node = document.querySelector(".visibility-options .checked");
        if(node != undefined) {
            node.parentNode.removeChild(node);
        }
    }

    if(sort === "to") {
        const node = document.querySelector(".participants-list .checked");
        if(node != undefined) {
            node.parentNode.removeChild(node);
        }   
    }

    element.parentNode.innerHTML += `
        <ion-icon class="checked" name="checkmark-sharp"></ion-icon>
    `;
}
 
