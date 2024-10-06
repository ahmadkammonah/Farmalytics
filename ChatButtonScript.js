var chatbox = document.getElementById('chatbox');
var chatIcon = document.getElementById('chatbox-icon');
var chatBody = document.getElementById('chatbox-body');
var chatInput = document.getElementById('chat-input');
var sendBtn = document.getElementById('send-btn');

// Function to toggle chatbox visibility
chatIcon.addEventListener('click', function () {
    if (chatbox.classList.contains('active')) {
        chatbox.classList.remove('active');
    } else {
        chatbox.classList.add('active');
    }
});

// Function to create message bubbles
function appendMessage(message, sender) {
    var messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    var messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    messageDiv.appendChild(messageContent);
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to bottom
}

// Event listener for the send button
sendBtn.addEventListener('click', function () {
    var message = chatInput.value;
    if (message.trim() !== '') {
        appendMessage(message, 'user');
        setTimeout(function () {
            appendMessage('This is a bot response', 'bot');
        }, 500); // Simulate a bot response delay
        chatInput.value = ''; // Clear input field
    }
});

// Enter key also sends a message
chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
