let stompClient = null;

function connect() {
    if (stompClient !== null) return;

    const serverIp = document.getElementById('serverIp').value;
    const username = document.getElementById('username').value.trim();

    if (serverIp.trim() === '' || username === '') {
        console.error('La IP del servidor y el usuario son obligatorios.');
        return;
    }
    
    const socket = new SockJS("http://" + serverIp.trim() + ":8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/public', function (message) {
            showMessage(JSON.parse(message.body));
        });
    }, function (error) {
        console.error('Error connecting to WebSocket:', error);
        stompClient = null;
        setConnected(false);
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
        stompClient = null;
    }
    setConnected(false);
    console.log("Disconnected");
}


function setConnected(connected) {
    const status = document.getElementById('status');
    if (connected) {
        status.className = 'connected';
        status.textContent = 'Conectado';
    } else {
        status.className = 'disconnected';
        status.textContent = 'Desconectado';
    }
    document.getElementById('message').disabled = !connected;
}

function sendMessage() {
    if (stompClient === null || !stompClient.connected) return;

    const username = document.getElementById('username').value.trim();
    const content = document.getElementById('message').value;
    
    if (username === '' || content.trim() === '') return;

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ 
        tipo: 'CHAT', 
        usuario: username, 
        contenido: content 
    }));
    
    document.getElementById('message').value = '';
}

function showMessage(message) {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    const author = document.createElement('strong');
    author.textContent = message.usuario + ':';
    messageDiv.append(author, document.createTextNode(' ' + message.contenido));
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Allow sending message with Enter key
document.getElementById('message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});