import { useEffect, useRef, useState } from "react";
import { Unit } from "./components/Unit";
import { Loading } from "./components/laoding";

export default function App() {

  const socket = useRef<WebSocket | null>(null);

  const inputRoom = useRef<HTMLInputElement>(null);
  const inputPool = useRef<HTMLInputElement>(null);

  const [memberCount, setMemberCount] = useState(0);
  const [inaRoom, setInaRoom] = useState(false);

  const [load, setLoading] = useState(false);

  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);
  const [percent3, setPercent3] = useState(0);
  const [percent4, setPercent4] = useState(0);


  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8080");

    socket.current = ws;

    // WebSocket connection
    ws.onopen = () => {
      console.log("Connected!!");
    };

    // Messages from backend
    ws.onmessage = (message) => {

      const obj = JSON.parse(message.data);

      console.log(obj);

      if (obj.type === "joinSuccess") {

        setInaRoom(true);
        setLoading(false);

        console.log(
          "Joined room:",
          obj.payload.room
        );
      }

      if (obj.type === "alreadyInRoom") {

        setLoading(false);

        alert("Already in a Room !!");
      }

      if (obj.type === "joinError") {

        setLoading(false);

        alert(obj.payload.content);
      }

      if (obj.type === "count") {

        setMemberCount(
          obj.payload.count
        );
      }

      if (obj.type === "fetchPercent") {

        const percentObj = obj.payload.content;

        setPercent1(percentObj.percent1);
        setPercent2(percentObj.percent2);
        setPercent3(percentObj.percent3);
        setPercent4(percentObj.percent4);
      }

      if (obj.type === "exitSuccess") {

        setInaRoom(false);
        setLoading(false);

        setMemberCount(0);

        setPercent1(0);
        setPercent2(0);
        setPercent3(0);
        setPercent4(0);

        if (inputRoom.current) {
          inputRoom.current.value = "";
        }

        console.log("Exited room");
      }

      if (obj.type === "notInRoom") {

        setLoading(false);

        alert("You are not in any room !!");
      }

      if (obj.type === "error") {

        console.log(
          obj.payload.content
        );
      }
    };

    ws.onclose = () => {

      console.log("Disconnected!!");

      setInaRoom(false);
    };

    return () => {
      ws.close();
    };

  }, []);


  function enterRoom() {

    if (!socket.current) {
      return;
    }

    if (
      socket.current.readyState !== WebSocket.OPEN
    ) {
      alert("WebSocket is not connected yet !!");
      return;
    }

    if (!inputRoom.current) {
      return;
    }

    const room = inputRoom.current.value.trim();

    if (room === "") {
      alert("Input is Empty !!");
      return;
    }

    if (inaRoom) {
      alert("Already in a Room !!");
      return;
    }

    setLoading(true);

    socket.current.send(
      JSON.stringify({
        type: "join",
        payload: {
          room: room
        }
      })
    );

    console.log("Join request sent");
  }


  function sendOption(option: 1 | 2 | 3 | 4) {

    if (!socket.current) {
      return;
    }

    if (
      socket.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    if (!inaRoom) {
      alert("Join a room first !!");
      return;
    }

    socket.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          option: option
        }
      })
    );
  }


  function exitRoom() {

    if (!socket.current) {
      return;
    }

    if (
      socket.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    if (!inaRoom) {
      alert("Join any room first !!");
      return;
    }

    socket.current.send(
      JSON.stringify({
        type: "exitRoom"
      })
    );

    console.log("Exit request sent");
  }


  return (
    <div className="flex w-screen h-screen justify-center items-center">

      <div
        id="card"
        className="bg-gray-100 w-[300px] border-4 justify-center items-center px-[20px] py-[20px]"
      >

        <div className="flex flex-col gap-[5px]">

          <div className="flex flex-row gap-[4px]">

            <input
              type="text"
              className="border-2 px-[5px]"
              placeholder="Room"
              ref={inputRoom}
              disabled={inaRoom}
            />

            <div className="border-2 w-full text-center font-bold">
              {memberCount}
            </div>

          </div>

          <div className="flex gap-[5px] justify-center items-center">

            <button
              className="border-3 w-full flex justify-center bg-green-300 font-bold cursor-pointer"
              onClick={enterRoom}
              disabled={load || inaRoom}
            >
              {load ? <Loading /> : "ENTER ROOM"}
            </button>

            <button
              className="border-3 w-full bg-red-400 font-bold cursor-pointer"
              onClick={exitRoom}
            >
              EXIT ROOM
            </button>

          </div>

          <input
            type="text"
            className="border-2 px-[5px] mt-[10px]"
            placeholder="Pool Title"
            ref={inputPool}
            disabled={!inaRoom}
          />

          <button
            className="border-3 font-bold bg-yellow-400 cursor-pointer"
            disabled={!inaRoom}
          >
            ADD
          </button>

        </div>

        {inaRoom && (

          <div className="border-3 rounded-[10px] px-[5px] py-[10px] mt-[20px] bg-gray-400 flex flex-col gap-[5px]">

            <span className="font-bold break-all">
              What is the question?
            </span>

            <Unit
              progress={percent1.toFixed(1)}
              option="pav bhaji"
              onChoose={() => {
                sendOption(1);
              }}
            />

            <Unit
              progress={percent2.toFixed(1)}
              option="chole"
              onChoose={() => {
                sendOption(2);
              }}
            />

            <Unit
              progress={percent3.toFixed(1)}
              option="paneer aloo paratha"
              onChoose={() => {
                sendOption(3);
              }}
            />

            <Unit
              progress={percent4.toFixed(1)}
              option="masala bhindi"
              onChoose={() => {
                sendOption(4);
              }}
            />

          </div>

        )}

      </div>

    </div>
  );
}