import { Message } from './messageModel.js';

const userId = localStorage.getItem('user_id');
let allMessages = []; 
let conversationDetails = null; 

// Function to show alert message
function showAlert(message, type) {
    const alertMessage = document.getElementById("alert-message");
    if (alertMessage) {
        alertMessage.textContent = message;
        alertMessage.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
        alertMessage.style.display = "block";
        setTimeout(() => {
            alertMessage.style.display = "none";
            alertMessage.className = 'alert-message'; // Reset class after hiding
        }, 3000);
    } else {
        console.error("Alert message element not found.");
    }
}

// Fetch messages every 15 seconds
const fetchInterval = setInterval(() => {
    if (userId) fetchMessages().catch(console.error);
}, 15000);

// Combined window.onload
window.onload = async () => {
    console.log("User ID on page load:", userId);
    if (userId) {
        await fetchMessages();
        const { senderId, receiverId, propertyId } = Object.fromEntries(new URLSearchParams(window.location.search));
        if (senderId && receiverId && propertyId) {
            openChat({ name: senderName, id: receiverId, propertyId });
        }
    } else {
        showAlert("User ID not found in local storage.", 'error');
    }
};


async function fetchMessages() {
    console.log("Fetching messages for user ID:", userId);
    if (!userId) return Promise.reject("User ID is not set.");

    try {
        const response = await fetch(API.chatFetch, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ userId }),
        });

        console.log("API Response Status:", response.status);
        const data = await response.json();
        if (data.success) {
            allMessages = data.messages.map(Message.fromJson);
            console.log(`Fetched ${allMessages.length} messages successfully.`);
            loadMessages(allMessages);
            return allMessages;
        } else {
            showAlert(data.message, 'error');
            return Promise.reject(data.message);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        showAlert("Failed to fetch messages. Please try again later.", 'error');
        return Promise.reject(error);
    }
}

async function openChat(participant) {
    console.log("OpenChat called with:", participant);
    const chatElements = ["chatWith", "chatArea", "placeholder", "chatMessages"].map(id => document.getElementById(id));
    
    if (chatElements.some(el => !el)) {
        console.error("Chat area elements not found.");
        return;
    }

    const [chatWith, chatArea, placeholder, chatMessages] = chatElements;
    chatWith.innerText = participant.name;
    chatArea.style.display = "flex";
    placeholder.style.display = "none";
    chatMessages.innerHTML = ""; // Clear previous messages

    const filteredMessages = allMessages.filter(msg => 
        (msg.senderId === String(participant.id) && msg.receiverId === String(userId) && msg.propertyId === String(participant.propertyId)) ||
        (msg.senderId === String(userId) && msg.receiverId === String(participant.id) && msg.propertyId === String(participant.propertyId))
    );

    if (filteredMessages.length === 0) {
        chatMessages.innerHTML = `<div class="no-messages">No messages yet</div>`;
        conversationDetails = { propertyId: participant.propertyId, senderId: userId, receiverId: participant.id };
        return;
    }

    const groupedMessages = filteredMessages.reduce((acc, msg) => {
        const dateKey = formatDate(msg.timeSent);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(msg);
        return acc;
    }, {});

    Object.entries(groupedMessages).forEach(([date, msgs]) => {
        chatMessages.appendChild(createDateHeader(date));
        msgs.forEach(msg => chatMessages.appendChild(createMessageDiv(msg)));
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
    conversationDetails = { propertyId: filteredMessages[0].propertyId, senderId: filteredMessages[0].senderId, receiverId: filteredMessages[0].receiverId };
}

function createDateHeader(date) {
    const dateHeader = document.createElement("div");
    dateHeader.className = "date-header";
    dateHeader.innerText = date;
    return dateHeader;
}

function createMessageDiv(msg) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${msg.senderId === userId ? "sent" : ""} ${!msg.sent ? "unread" : ""}`;
    messageDiv.innerHTML = `
        <div class="content">${msg.content}</div>
        <div class="timestamp">${new Date(msg.timeSent).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>`;
    return messageDiv;
}

// Load messages into the chat
let activeConversationId = null; 

function loadMessages(messages) {
    const messageContainer = document.getElementById('contacts');
    if (!messageContainer) {
        console.error("Message container element not found.");
        return;
    }

    messageContainer.innerHTML = messages.length ? "" : "No messages found.";

    // Group conversations by propertyId and user pair (ignoring sender/receiver order)
    const groupedConversations = messages.reduce((acc, message) => {
        const key = `${message.propertyId}-${[message.senderId, message.receiverId].sort().join('-')}`;
        if (!acc[key]) {
            acc[key] = {
                messages: [],
                propertyId: message.propertyId,
                participantId: (message.senderId === userId ? message.receiverId : message.senderId),
                participantName: message.receiverName || "Unknown",
                avatar: message.avatar || 'https://via.placeholder.com/40',
                unreadCount: 0
            };
        }
        acc[key].messages.push(message);
        if (!message.sent) acc[key].unreadCount++;
        return acc;
    }, {});

    // Sort conversations by the last message's time
    const sortedConversations = Object.values(groupedConversations).map(conversation => ({
        ...conversation,
        lastMessageTime: new Date(conversation.messages[conversation.messages.length - 1].timeSent),
    })).sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    sortedConversations.forEach(conversation => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const houseDetails = getHouseDetails(conversation.propertyId);
        const houseProfileImage = houseDetails ? getHouseProfileImage(conversation.propertyId) : 'path/to/default_avatar_image.jpg';

        const conversationCard = document.createElement("div");
        conversationCard.className = "conversation-card";
        conversationCard.innerHTML = `
        <img src="${houseProfileImage}" alt="${houseDetails ? houseDetails.houseType : 'Unknown'} Image" class="avatar" />
        <div class="card-content">
            <div class="card-header">${houseDetails ? houseDetails.houseType : 'Unknown House Type'}</div>
            <div class="card-header">${conversation.participantName}</div>
            <div class="message-preview ${lastMessage.sent ? '' : 'unread'}">${lastMessage.content}</div>
            <div class="timestamp">${formatDate(lastMessage.timeSent)} at ${new Date(lastMessage.timeSent).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            ${conversation.unreadCount > 0 ? `<div class="unread-count">${conversation.unreadCount}</div>` : ''}
        </div>`;

        // Open chat on card click
        conversationCard.onclick = () => {
            openChat({
                name: conversation.participantName,
                id: conversation.participantId,
                propertyId: conversation.propertyId
            });

            activeConversationId = conversation.propertyId + '-' + conversation.participantId;

            // Mark this card as active
            const allCards = document.querySelectorAll('.conversation-card');
            allCards.forEach(card => card.classList.remove('active-conversation'));
            conversationCard.classList.add('active-conversation');
        };

        // Highlight the currently active conversation card
        if (activeConversationId === conversation.propertyId + '-' + conversation.participantId) {
            conversationCard.classList.add('active-conversation');
        }

        messageContainer.appendChild(conversationCard);
    });
}



// Search functionality
document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('searchInput');
    const clearSearchIcon = document.getElementById('clearSearch');
    const noResultsMessage = document.createElement("div");

    noResultsMessage.innerText = "No results found.";
    noResultsMessage.className = "no-results-message"; // Add styles as needed
    noResultsMessage.style.display = "none"; // Hidden by default
    document.querySelector(".search-bar").appendChild(noResultsMessage); // Append to the search bar

    // Show or hide the clear button based on input field content
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() !== '') {
            clearSearchIcon.style.display = 'inline-block'; // Show icon
        } else {
            clearSearchIcon.style.display = 'none'; // Hide icon
        }

        const query = searchInput.value.toLowerCase();
        const messageContainer = document.getElementById('contacts');
        const conversationCards = messageContainer.getElementsByClassName("conversation-card");

        let resultsFound = false;

        Array.from(conversationCards).forEach(card => {
            const cardContent = card.innerText.toLowerCase();
            const isVisible = cardContent.includes(query);
            card.style.display = isVisible ? "" : "none";
            if (isVisible) resultsFound = true;
        });

        // Show or hide the no results message based on search results
        noResultsMessage.style.display = resultsFound ? "none" : "block";
    });

    // Clear the search input when the icon is clicked
    clearSearchIcon.addEventListener('click', function() {
        searchInput.value = ''; // Clear the input field
        clearSearchIcon.style.display = 'none'; // Hide the icon
        noResultsMessage.style.display = "none"; // Hide the no results message
        const messageContainer = document.getElementById('contacts');
        const conversationCards = messageContainer.getElementsByClassName("conversation-card");

        Array.from(conversationCards).forEach(card => {
            card.style.display = ""; // Show all cards
        });
    });

    // Existing event listeners
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.querySelector('.exit-chat-btn').addEventListener('click', exitChat);
    document.querySelector('.toggle-dark-mode').addEventListener('click', toggleDarkMode);
});


// Utility functions
function getHouseDetails(propertyId) {
    const existingHouses = JSON.parse(sessionStorage.getItem('houseData')) || [];
    return existingHouses.find(house => house.houseId === Number(propertyId));
}


function getHouseProfileImage(propertyId) {
    const house = getHouseDetails(propertyId);
    if (house) {
        const url = `${API.profileImage}${house.houseProfileImage}`;
        console.log(`House Profile Image URL: ${url}`);
        return url;
    }
    console.log('House not found, returning default image.');
    return '/IMAGES/lightlogo.jpg';
}


// Initialize chat from URL parameters
const { senderId, receiverId, propertyId, senderName } = Object.fromEntries(new URLSearchParams(window.location.search));
if (senderId && receiverId && propertyId) {
    document.getElementById("chatWith").innerText = receiverId;
    document.getElementById("chatArea").style.display = "flex";
    document.getElementById("placeholder").style.display = "none";
    openChat({ name: senderName, id: receiverId, propertyId });
}


// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// Send message function
async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const messageContent = messageInput.value.trim();

    if (!messageContent) {
        showAlert("Message cannot be empty.", 'error');
        return;
    }
    if (!conversationDetails) {
        showAlert("Could not retrieve conversation details.", 'error');
        return;
    }

    const { propertyId, receiverId } = conversationDetails;

    if (!userId || !propertyId || !receiverId) {
        showAlert("Required information is missing.", 'error');
        return;
    }

    toggleSendButtonState(true);

    try {
        const response = await fetch(API.chatApp, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ senderId: userId, receiverId, propertyId, content: messageContent }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (data.success) {
            const newMessage = { content: messageContent, timeSent: new Date().toISOString(), senderId: userId, receiverId, propertyId, sent: true };
            allMessages.push(newMessage);
            addMessageToChat(newMessage);
            loadMessages(allMessages);
            messageInput.value = "";
            showAlert("Message sent successfully!", 'success');
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert("Failed to send message. Please try again later.", 'error');
    } finally {
        toggleSendButtonState(false);
    }
}

function toggleSendButtonState(isSending) {
    const sendButton = document.getElementById("sendButton");
    const messageInput = document.getElementById("messageInput");
    const sendingIcon = document.getElementById("sendingIcon");
    const sendIcon = document.getElementById("sendIcon");

    sendButton.disabled = isSending;
    messageInput.disabled = isSending;
    sendingIcon.style.display = isSending ? "inline-block" : "none";
    sendIcon.style.display = isSending ? "none" : "inline-block";
}

// Function to add message to chat directly
function addMessageToChat(message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message sent";
    messageDiv.innerHTML = `
        <div class="content">${message.content}</div>
        <div class="timestamp">${new Date(message.timeSent).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>`;
    document.getElementById("chatMessages").appendChild(messageDiv);
}

// Exit chat
function exitChat() {

    activeConversationId = null;

 
    const chatArea = document.getElementById("chatArea");
    const chatMessages = document.getElementById("chatMessages");
    const chatWith = document.getElementById("chatWith");
    const placeholder = document.getElementById("placeholder");

    if (chatArea && chatMessages && chatWith && placeholder) {
        chatArea.style.display = "none"; 
        chatMessages.innerHTML = ""; 
        chatWith.innerText = "";
        placeholder.style.display = "flex"; 
    }

    const allCards = document.querySelectorAll('.conversation-card');
    allCards.forEach(card => card.classList.remove('active-conversation'));
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const icon = document.getElementById("mode-icon");
    icon.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}
function goBack() {
    window.history.back(); 
  }
  

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('go-back-btn').addEventListener('click', goBack);
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.querySelector('.exit-chat-btn').addEventListener('click', exitChat);
    document.querySelector('.toggle-dark-mode').addEventListener('click', toggleDarkMode);
});

