import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let users = [];
function updateRoomCount(roomId) {
    const roomMembers = users.filter((user) => user.room === roomId);
    roomMembers.forEach((user) => {
        user.socket.send(JSON.stringify({
            type: "count",
            payload: {
                count: roomMembers.length,
            }
        }));
    });
}
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        // {
        //   "type" : "join",
        // }
        try {
            const messageObject = JSON.parse(message.toString());
            if (messageObject.type === "join") {
                const matched = users.some(user => user.socket === socket && user.room === messageObject.payload?.room);
                if (!matched && messageObject.payload?.room) {
                    users.push({
                        socket: socket,
                        room: messageObject.payload.room
                    });
                    updateRoomCount(messageObject.payload.room);
                    console.log(users);
                }
                if (matched) {
                    console.log("user already exists !!");
                }
            }
            if (messageObject.type === "chat") {
                const room = users.find(u => u.socket === socket)?.room;
                if (room) {
                    const roomUsers = users.filter(user => (user.room === room));
                    roomUsers.forEach(user => user.socket.send(JSON.stringify(messageObject)));
                }
            }
            if (messageObject.type === "exitRoom") {
                const user = users.find(user => user.socket === socket);
                if (user && user.room !== "") {
                    const userRoom = user.room;
                    user.room = "";
                    updateRoomCount(userRoom);
                    user.socket.send(JSON.stringify({
                        type: "count",
                        payload: {
                            count: 0,
                        }
                    }));
                }
                console.log(users);
            }
        }
        catch (e) {
            console.log("Invalid message is received !! " + e);
        }
    });
    socket.on("close", () => {
        users = users.filter((f) => f.socket !== socket);
        console.log(users);
    });
});
//# sourceMappingURL=index.js.map