/* eslint-disable array-callback-return */
const socket = io();
const messages = document.getElementById('messages');

// $(document).ready(() => {
//   // This file just does a GET request to figure out which user is logged in
//   // and updates the HTML on the page
//   $.get('/api/user_data').then(data => {
//     $('.member-name').text(data.email);
//   });
// });

(function () {
  let sender = '';
  $(document).ready(() => {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get('/api/user_data').then(data => {
      $('.member-name').text(data.email);
      sender = data.email;
    });
  });

  $('form').submit((e) => {
    
    const li = document.createElement('li');
    e.preventDefault(); // prevents page reloading
    const data = {
      message: $('#message').val(),
      user: sender
    };
    socket.emit('chat message', data);

    messages.appendChild(li).append($('#message').val());
    const span = document.createElement('span');
    // messages.appendChild(span).append('by ' + 'Anonymous' + ': ' + 'just now');
    messages.appendChild(span).append('by: ' + sender);

    $('#message').val('');

    return false;
  });

  socket.on('received', data => {
    console.log(data);
    const li = document.createElement('li');
    const span = document.createElement('span');
    const messages = document.getElementById('messages');
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append('by ' + data.user + ': ' + 'just now');
    console.log('Hello bingo!');
  });
})();

// fetching initial chat messages from the database
(function () {
  fetch('/chats')
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        messages.appendChild(li).append(data.message);
        messages
          .appendChild(span)
          .append('by ' + data.sender + ': ' + formatTimeAgo(data.createdAt));
      });
    });
})();

//is typing...

const messageInput = document.getElementById('message');
const typing = document.getElementById('typing');

//isTyping event
messageInput.addEventListener('keypress', () => {
  socket.emit('typing', { user: 'Someone', message: 'is typing...' });
});

socket.on('notifyTyping', data => {
  typing.innerText = data.user + ' ' + data.message;
  console.log(data.user + data.message);
});

//stop typing
messageInput.addEventListener('keyup', () => {
  socket.emit('stopTyping', '');
});

socket.on('notifyStopTyping', () => {
  typing.innerText = '';
});
