const nameInput = document.getElementById(`my-name-input`);
const myMessage = document.getElementById(`my-message`);
const sendButton = document.getElementById(`send-button`);
const saveButton = document.getElementById(`save-button`);
const chatBox = document.getElementById(`chat`);
const serverURL = `https://it3049c-chat-application.herokuapp.com/messages`;
const MILLISECONDS_IN_TEN_SECONDS = 10000;

setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);

if(localStorage.getItem(`username`)) {
  nameInput.value = localStorage.getItem(`username`);
  sendButton.disabled = false;
  myMessage.disabled = false;
} else {
  sendButton.disabled = true;
  myMessage.disabled = true;// setAttribute(`disabled`, `true`);
}

sendButton.addEventListener(`click`, function(sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = localStorage.getItem(`username`);
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value = ``;
});
saveButton.addEventListener(`click`, function(saveEvent) {
  // eslint-disable-next-line no-debugger
  debugger;
  saveEvent.preventDefault();
  const sender = nameInput.value;
  localStorage.setItem(`username`, sender);
  sendButton.disabled = false;
  myMessage.disabled = false;
});

function fetchMessages() {
  return fetch(serverURL)
    .then( response => response.json());
}
async function updateMessages() {
  // Fetch Messages
  const messages = await fetchMessages();

  // Loop over the messages. Inside the loop we will
  // get each message
  // format it
  // add it to the chatbox
  let formattedMessages = ``;
  messages.forEach(message => {
    formattedMessages += formatMessage(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
  console.log(messages);
}

function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
    return `
      <div class="mine messages">
          <div class="message">
              ${message.text}
          </div>
          <div class="sender-info">
              ${formattedTime}
          </div>
      </div>
      `;
  } else {
    return `
          <div class="yours messages">
              <div class="message">
                  ${message.text}
              </div>
              <div class="sender-info">
                  ${message.sender} ${formattedTime}
              </div>
          </div>
      `;
  }
}
function sendMessages(username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date()
  };

  fetch (serverURL, {
    method: `POST`, 
    headers: {
      'Content-Type': `application/json`
    },
    body: JSON.stringify(newMessage)
  });
}

updateMessages();
