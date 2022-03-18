import * as lib from '../lib/lib.js';

let socket = io();
socket.on('update-users-list', (users) => {
    lib.updateUserList(users, socket);
});

socket.on('remove-user', (user) => {
    lib.removeUser(user);
});

socket.on('call-made', ({offer, socketId}) => {
    lib.callMade({offer, socketId}, socket);
    console.log('call-made');
});

socket.on('answer-made', ({answer, socketId}) => {
    lib.answerMade({answer, socketId}, socket);
    console.log('answer-made');
})

export default socket;