// Variables for chatbox functionality
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

// Function to send message to the Flask API
async function sendMessageToAPI(message) {
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });
        const data = await response.json();
        if (response.ok) {
            appendMessage(data.response, 'bot');
        } else {
            appendMessage('Error: Failed to get a response from the API', 'bot');
        }
    } catch (error) {
        appendMessage(`Error: ${error.message}`, 'bot');
    }
}

async function startChat() {
    let message = $('#message').val();

    let messages = sessionStorage.getItem("bot-message");
    if (messages == null) {
        messages = [{ role: "system", content: "You are ChatGPT, a large language model trained by OpenAI." }];
    } else {
        messages = JSON.parse(messages);
    }
    messages.push({ role: "user", content: message });

    // Append the user's message to the chat
    appendMessage(message, 'user');

    // Send the messages to your Flask backend
    var response = await fetch(
        "http://localhost:5000/chat",
        {
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/event-stream"
            },
            method: "POST",
            body: JSON.stringify({
                messages: messages
            }),
        }
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botReply = '';
    let done = false;

    // Append an empty message for the bot's reply
    appendMessage('', 'bot');

    while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring('data: '.length);
                    botReply += data;
                    // Update the last bot message in the chat
                    updateLastBotMessage(botReply);
                }
            }
        }
    }

    // Save the assistant's reply in sessionStorage
    messages.push({ role: "assistant", content: botReply });
    sessionStorage.setItem("bot-message", JSON.stringify(messages));
}

// Function to append a new message to the chat
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

// Function to update the last bot message in the chat
function updateLastBotMessage(content) {
    const messages = chatBody.getElementsByClassName('message bot');
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const messageContent = lastMessage.querySelector('.message-content');
        messageContent.textContent = content;
    }
}

// Event listener for the send button
sendBtn.addEventListener('click', function () {
    var message = chatInput.value;
    if (message.trim() !== '') {
        appendMessage(message, 'user');
        sendMessageToAPI(message); // Call the API with the user input
        chatInput.value = ''; // Clear input field
    }
});

// Enter key also sends a message
chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
