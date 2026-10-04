import { useEffect, useRef, useState } from "react"
import {Unit} from "./components/Unit"
import { Loading } from "./components/laoding"

export default function App() {

  const socket = useRef <WebSocket>(null)

  const inputRoom = useRef<HTMLInputElement>(null)
  const inputPool = useRef<HTMLInputElement>(null)

  const [memberCount, setmemberCount] = useState(0)
  const [inaRoom , setinaRoom] = useState(false)

  const [load , setLoading] = useState(false);
  const time = 500;

  const [percent1 , setPercent1] = useState(0);
  const [percent2 , setPercent2] = useState(0);
  const [percent3 , setPercent3] = useState(0);
  const [percent4 , setPercent4] = useState(0);

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");

    //with the help of useRef!!
    socket.current = ws;

    ws.onopen = ()=>{
      console.log("Connected!!") 
    }

    // automatically runs when any new message comes from the backend !! 
    ws.onmessage =(message)=>{

      const obj = JSON.parse(message.data)
      console.log(obj)

      // These can be the value of the "obj" !!
      
      // obj = {
      //   type : "chat" | "count" | "fetchPercent",
      //   payload? : {
      //     content? : string,
      //     count? : string
      //     option? : 1 | 2 | 3 | 4 ;
      // }

      if(obj.type === "checkRoom" ){

        setinaRoom(obj.payload.content)
        
      }

      if (obj.type === "chat"){

        // {
        //   type : "chat",
        //   payload : {
        //     content : users
        // } 

        const users= obj.payload.content;
        // console.log(users)
      }

      if(obj.type === "count"){

        // {
        //   type: "count",
        //   payload :{
        //     count: roomMembers.length,
        //   }  
        // }

        setmemberCount(obj.payload.count);
      }

      if(obj.type === "fetchPercent"){

        // {
        //   type : "fetchPercent",
        //   payload :{
        //     content : {
        //       percent1 : percent1,
        //       percent2 : percent2,
        //       percent3 : percent3,
        //       percent4 : percent4,
        //     }
        //   }
        // }

        const percentObj =  obj.payload.content
        setPercent1(percentObj.percent1)
        setPercent2(percentObj.percent2)
        setPercent3(percentObj.percent3)
        setPercent4(percentObj.percent4)

      }
    }  

    ws.onclose =()=>{
      console.log("Disconnected!!")
    }

    // user closed the window and hence function unmounts then this return
    //  is called to close the connection !!
    return ()=>{
      ws.close();
    }

  } , [])

  function checkInRoom(){

    if(socket.current && inputRoom.current){ 

      socket.current.send(
        JSON.stringify({
          type : "checkRoom"
        })
      )
    }

  }


  function enterRoom(){

    if(socket.current && inputRoom.current){ 

      checkInRoom();

      // This will return a boolean which is stored inside a variable of name "inaRoom" !!

      setTimeout(()=>{

        if(inaRoom === false && socket.current && inputRoom.current){
          if(inputRoom.current?.value != "" ){
            socket.current.send(
              JSON.stringify({
                type : "join",
                payload : {
                  room : inputRoom.current.value
                }
              }) 
            ) 
            console.log("Request Send !!");
            setinaRoom(true)
            fetchPercent();
          }  
          else{
            alert("Input is Empty !!")
          }
        }
        else if(inaRoom === true){
          alert("Already in a Room !!")
        } 
      } ,time)
    }
    else{
      console.log("Something Unexpected Occoured !!")
    }
  }

   function sendOption(prop : number){

    // console.log(prop)

    if(socket.current){
      socket.current.send(
        JSON.stringify({
          type : "chat",
          payload : {
            option : prop
          }
        })
      )
    }
  }

  function fetchPercent(){

    if(socket.current){
      socket.current.send(
        JSON.stringify({
          type : "percentFetch",  
        })
      )
    }
  }

  function exitRoom(){
    
    if(socket.current && memberCount !== 0){
      socket.current.send(
        JSON.stringify({
          type : "exitRoom"
        })
      )

      setinaRoom(false)
      console.log("User Exited Room!!")
    }
    else{
      alert("Join any room first !!")
    }
  }

  function loadingIcon(){

    setLoading(true) ;

    setTimeout(()=>{
      setLoading(false)

    } , time) 
  }

  return(
    <div className="flex w-screen h-screen justify-center items-center">

      <div id={"card"} className=" bg-gray-100 w-[300px] border-4 justify-center items-center px-[20px] py-[20px]">
        <div className="flex flex-col gap-[5px]" >

          <div className="flex flex-row gap-[4px]">
            <input type="text" className="border-2 px-[5px]" placeholder="Room" ref={inputRoom}/>
            <div className="border-2 w-full text-center font-bold">{memberCount}</div>
          </div>

          <div className="flex gap-[5px] justify-center items-center">

            <button className="border-3 w-full flex justify-center bg-green-300 font-bold cursor-pointer" onClick={()=>{
              enterRoom();  
              loadingIcon()
            }}>
              {load ? <Loading /> : "ENTER ROOM"}
            </button>


            <button className="border-3 w-full bg-red-400 font-bold cursor-pointer" onClick={()=>{
              exitRoom();
              if(inputRoom.current){
                inputRoom.current.value = ""
              }
              setPercent1(0);
              setPercent2(0);
              setPercent3(0);
              setPercent4(0);

            }}>EXIT ROOM</button>

          </div>

          <input type="text" className="border-2 px-[5px] mt-[10px]" placeholder="Pool Title" ref={inputPool}/>
          <button className="border-3 font-bold bg-yellow-400 cursor-pointer">ADD</button>

        </div>

        {(inaRoom) ? 
        
          <div className="border-3 rounded-[10px] px-[5px] py-[10px] mt-[20px] bg-gray-400 flex flex-col gap-[5px]">

            <span className="font-bold break-all">What is the question?</span>
            <Unit progress={percent1.toFixed(1)} option={"pav bhaji"} onChoose={()=>{
              sendOption(1)
              fetchPercent();
            }}></Unit>

            <Unit progress={percent2.toFixed(1)} option={"chole"} onChoose={()=>{
              sendOption(2)
              fetchPercent();
            }}></Unit>

            <Unit progress={percent3.toFixed(1)} option={"paneer aloo paratha"} onChoose={()=>{
              sendOption(3)
              fetchPercent();
            }}></Unit> 

            <Unit progress={percent4.toFixed(1)} option={"masala bhindi"} onChoose={()=>{
              sendOption(4)
              fetchPercent();  
            }}></Unit>  
          
          </div>
          : null
        }

      </div>
    
    </div>   
  )
}

