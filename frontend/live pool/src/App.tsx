import { useEffect, useRef, useState } from "react"
import {Unit} from "./components/Unit"

export default function App() {

  const socket = useRef<WebSocket | null>(null)

  const inputRoom = useRef<HTMLInputElement>(null)
  const inputPool = useRef<HTMLInputElement>(null)
  const [memberCount, setmemberCount] = useState(0)

  const [percent1 , setPercent1] = useState(0);
  const [percent2 , setPercent2] = useState(0);
  const [percent3 , setPercent3] = useState(0);
  const [percent4 , setPercent4] = useState(0);

  const [countTotal , setTotalCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
 

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");

    socket.current = ws;

    ws.onopen = ()=>{
      console.log("Connected!!") 
    }

    ws.onmessage =(message)=>{

      const obj = JSON.parse(message.data)
      console.log(obj)

      if (obj.type === "chat"){
        const option = obj.payload.content;

        setTotalCount(c => c + 1);

        if (option === 1) {
          setCount1(c => c + 1);  
          console.log("first")   
        }

        if (option === 2) {
          setCount2(c => c + 1);    
        }

        if (option === 3) {
          setCount3(c => c + 1);
        }

        if (option === 4) {
          setCount4(c => c + 1);
        }
      }
      if(obj.type === "count"){
        setmemberCount(obj.payload.count);
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

  useEffect(()=>{

    setPercent1(count1/countTotal*100 || 0)
    setPercent2(count2/countTotal*100 || 0)
    setPercent3(count3/countTotal*100 || 0)
    setPercent4(count4/countTotal*100 || 0)

  } , [count1 ,count2 ,count3 ,count4])

  function enterRoom(){
    if(socket.current && inputRoom.current){ 
      if(inputRoom.current?.value !== ""){
        socket.current.send(
          JSON.stringify({
            type : "join",
            payload : {
              room : inputRoom.current.value
            }
          })
        )     
        console.log("Request Send !!")
      }
      else{
        alert("Input Is Empty!!")
      } 
    }
  }

  function exitRoom(){
    
    if(socket.current && memberCount !== 0){
      socket.current.send(
        JSON.stringify({
          type : "exitRoom"
        })
      )

      console.log("User Exited Room!!")
    }
    else{
      alert("Join any room first !!")
    }
  }

  function sendOption(prop : number){

    // console.log(prop)

    if(socket.current){
      socket.current.send(
        JSON.stringify({
          type : "chat",
          payload : {
            content : prop
          }
        })
      )
    }
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

            <button className="border-3 w-full bg-green-300 font-bold cursor-pointer" onClick={()=>{
              enterRoom();
            }}>ENTER ROOM</button>

            <button className="border-3 w-full bg-red-400 font-bold cursor-pointer" onClick={()=>{
              exitRoom();
              if(inputRoom.current){
                inputRoom.current.value = ""
              }
            }}>EXIT ROOM</button>

          </div>

          <input type="text" className="border-2 px-[5px] mt-[10px]" placeholder="Pool Title" ref={inputPool}/>
          <button className="border-3 font-bold bg-yellow-400 cursor-pointer">ADD</button>

        </div>

        <div className="border-3 rounded-[10px] px-[5px] py-[10px] mt-[20px] bg-gray-400 flex flex-col gap-[5px]">

          <span className="font-bold break-all">What is the question?</span>
          <Unit progress={percent1.toFixed(1)} option={"pav bhaji"} onChoose={()=>{sendOption(1)}}></Unit>
          <Unit progress={percent2.toFixed(1)} option={"chole"} onChoose={()=>{sendOption(2)}}></Unit>
          <Unit progress={percent3.toFixed(1)} option={"paneer aloo paratha"} onChoose={()=>{sendOption(3)}}></Unit>  
          <Unit progress={percent4.toFixed(1)} option={"masala bhindi"} onChoose={()=>{sendOption(4)}}></Unit>  
        
        </div>

      </div>
    
    </div>   
  )
}

