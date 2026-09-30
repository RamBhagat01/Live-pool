import { WebSocketServer , WebSocket} from "ws";
const wss = new WebSocketServer({port : 8080});

interface user {
  socket : WebSocket,
  room : string
}

let users:user[] = []; 

wss.on("connection" , (socket)=>{

  socket.on("message" , (message)=>{

    interface mess {
      type : "join" | "chat",
      payload? : {
        content? : string,
        room? : string
      }
    }

    // {
    //   "type" : "join",
    // }

    try{
      const messageObject : mess = JSON.parse(message.toString());

      if (messageObject.type === "join"){

        if ( messageObject.payload?.room){
          users.push({
            socket : socket,
            room : messageObject.payload?.room
          })
        }
        console.log(users)
      }

      else if(messageObject.type === "chat"){
        users.forEach(user => user.socket.send(JSON.stringify(messageObject.payload?.content)))
      }

      else{
        socket.send("join first!!")
      }
    }
    catch(e){
      console.log("Invalid message is received !! " + e);
    }

  })

  socket.on("close" , ()=>{
    users = users.filter((f) => f.socket !== socket)  
    console.log(users);
  })

})