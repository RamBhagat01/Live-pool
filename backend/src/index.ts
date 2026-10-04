import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
  option: 1 | 2 | 3 | 4 | "";
}

interface mess {
  type: "join" | "chat" | "exitRoom" | "percentFetch";
  payload?: {
    room?: string;
    option?: 1 | 2 | 3 | 4 | "";
  };
}

let users: User[] = [];

function updateRoomCount(roomId: string) {

  const roomMembers = users.filter(
    (user) => user.room === roomId
  );

  roomMembers.forEach((user) => {
    user.socket.send(
      JSON.stringify({
        type: "count",
        payload: {
          count: roomMembers.length
        }
      })
    );
  });
}

function updatePercent(roomId: string) {

  const roomUsers = users.filter((user) => user.room === roomId
  );

  const totalUsers = roomUsers.length;

  if (totalUsers === 0) {
    return;
  }

  const count1 = roomUsers.filter((user) => 
    user.option === 1
  ).length;

  const count2 = roomUsers.filter((user) => 
    user.option === 2
  ).length;

  const count3 = roomUsers.filter((user) => 
    user.option === 3
  ).length;

  const count4 = roomUsers.filter((user) => 
    user.option === 4
  ).length;


  const percent1 = (count1 / totalUsers) * 100;
  const percent2 = (count2 / totalUsers) * 100;
  const percent3 = (count3 / totalUsers) * 100;
  const percent4 = (count4 / totalUsers) * 100;


  roomUsers.forEach((user) => {
    user.socket.send(
      JSON.stringify({
        type: "fetchPercent",
        payload: {
          content: {
            percent1: percent1,
            percent2: percent2,
            percent3: percent3,
            percent4: percent4
          }
        }
      })
    );

  });
}

wss.on("connection", (socket) => {

  console.log("new user connected !!");

  socket.on("message", (message) => {

    try {
      const messageObject: mess = JSON.parse(message.toString());

      if(messageObject.type === "join") {

        const room = messageObject.payload?.room?.trim();
        if (!room) {
          socket.send(
            JSON.stringify({
              type: "joinError",
              payload: {
                content: "Room name is empty"
              }
            })
          );

          return;
        }


        // Check whether this socket already has a room

        const user = users.find((user) => 
          user.socket === socket
        );

        if (user) {
          if (user.room !== "") {
            socket.send(
              JSON.stringify({
                type: "alreadyInRoom"
              })
            );
            return;
          }

          user.room = room;
          user.option = "";

          socket.send(
            JSON.stringify({
              type: "joinSuccess",
              payload: {
                room: room
              }
            })
          );

          updateRoomCount(room);
          updatePercent(room);
          console.log(users);
          return;
        }

        users.push({
          socket: socket,
          room: room,
          option: ""
        });

        socket.send(
          JSON.stringify({
            type: "joinSuccess",
            payload: {
              room: room
            }
          })
        );

        updateRoomCount(room);
        updatePercent(room);

        console.log(users);
      }

      else if (messageObject.type === "chat") {

        const user = users.find(
          (user) => user.socket === socket
        );


        if (!user || user.room === "") {

          socket.send(
            JSON.stringify({
              type: "error",
              payload: {
                content: "Join a room first"
              }
            })
          );

          return;
        }


        const option = messageObject.payload?.option;

        if (
          option !== 1 &&
          option !== 2 &&
          option !== 3 &&
          option !== 4
        ) {

          socket.send(
            JSON.stringify({
              type: "error",
              payload: {
                content: "Invalid option"
              }
            })
          );

          return;
        }


        // Store selected option

        user.option = option;

        console.log(
          `User selected option ${option}`
        );


        // Send updated percentages
        // to everyone in the same room

        updatePercent(user.room);
      }

      else if (messageObject.type === "percentFetch") {

        const user = users.find((user) => 
          user.socket === socket
        );


        if (!user || user.room === "") {

          socket.send(
            JSON.stringify({
              type: "error",
              payload: {
                content: "Join a room first"
              }
            })
          );

          return;
        }
        updatePercent(user.room);
      }

      else if (messageObject.type === "exitRoom") {

        const user = users.find((user) => 
          user.socket === socket
        );


        if (!user || user.room === "") {

          socket.send(
            JSON.stringify({
              type: "notInRoom"
            })
          );

          return;
        }

        // Save old room

        const oldRoom = user.room;

        // Remove user from room
        user.room = "";

        // Reset selected option
        user.option = "";

        console.log(
          `User exited room ${oldRoom}`
        );

        // Tell frontend that exit was successful
        socket.send(
          JSON.stringify({
            type: "exitSuccess"
          })
        );

        // Update remaining users
        updateRoomCount(oldRoom);
        // Update remaining users' percentages
        updatePercent(oldRoom);
        console.log(users);
      }

    }

    catch (error) {
      console.log(
        "Invalid message received !!", error
      );

    }

  });

  socket.on("close", () => {

    const user = users.find(
      (user) => user.socket === socket
    );


    if (user && user.room !== "") {

      const oldRoom = user.room;
      // Remove user completely

      users = users.filter(
        (user) => user.socket !== socket
      );

      // Update remaining room members
      updateRoomCount(oldRoom);
      updatePercent(oldRoom);

    }
    else {
      users = users.filter(
        (user) => user.socket !== socket
      );
    }

    console.log(
      "User disconnected"
    );
    console.log(users);

  });

});