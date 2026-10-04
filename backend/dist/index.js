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
                // check if array has user already !!
                const matched = users.some(user => user.socket === socket && user.room === messageObject.payload?.room);
                //to push new user into the array !!
                if (!matched && messageObject.payload?.room) {
                    users.push({
                        socket: socket,
                        room: messageObject.payload.room,
                        option: ""
                    });
                    updateRoomCount(messageObject.payload.room);
                    console.log(users);
                }
                if (matched) {
                    console.log("user already exists !!");
                }
            }
            if (messageObject.type === "checkRoom") {
                const user = users.find(u => u.socket === socket);
                if (user) {
                    if (user.room !== "") {
                        user.socket.send(JSON.stringify({
                            type: "checkRoom",
                            payload: {
                                content: true //already in a room  
                            }
                        }));
                    }
                    else {
                        user.socket.send(JSON.stringify({
                            type: "checkRoom",
                            payload: {
                                content: false //not in a room  
                            }
                        }));
                    }
                }
            }
            if (messageObject.type === "chat") {
                //inserting option to already created array object !!
                const user = users.find(u => u.socket === socket);
                if (user && messageObject.payload?.option) {
                    user.option = messageObject.payload.option;
                }
                //sending back reply to frontend !!
                const room = users.find(u => u.socket === socket)?.room;
                if (room) {
                    const roomUsers = users.filter(user => (user.room === room));
                    roomUsers.forEach(user => user.socket.send(JSON.stringify(JSON.stringify({
                        type: "chat",
                        payload: {
                            content: "users array!!"
                        }
                    }))));
                }
            }
            if (messageObject.type === "percentFetch") {
                const userRoom = users.find(u => u.socket === socket)?.room;
                const userinRoom = users.filter(u => u.room === userRoom);
                if (userinRoom) {
                    const totalUsers = userinRoom.length;
                    const count1 = userinRoom.filter(u => u.option === 1).length;
                    const percent1 = (count1 / totalUsers) * 100;
                    const count2 = userinRoom.filter(u => u.option === 2).length;
                    const percent2 = (count2 / totalUsers) * 100;
                    const count3 = userinRoom.filter(u => u.option === 3).length;
                    const percent3 = (count3 / totalUsers) * 100;
                    const count4 = userinRoom.filter(u => u.option === 4).length;
                    const percent4 = (count4 / totalUsers) * 100;
                    userinRoom.forEach(user => user.socket.send(JSON.stringify({
                        type: "fetchPercent",
                        payload: {
                            content: {
                                percent1: percent1,
                                percent2: percent2,
                                percent3: percent3,
                                percent4: percent4,
                            }
                        }
                    })));
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