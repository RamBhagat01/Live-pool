export function Add(){
  return(
    <div className="flex flex-col gap-[5px]" >

      <div className="flex flex-row gap-[4px]">
        <input type="text" className="border-2 px-[5px]" placeholder="Room"/>
        <div className="border-2 w-full text-center font-bold">120</div>
      </div>

      <div className="flex gap-[5px] justify-center items-center">
        <button className="border-3 w-full bg-green-300 font-bold">ENTER ROOM</button>
        <button className="border-3 w-full bg-red-400 font-bold">EXIT ROOM</button>
      </div>

      <input type="text" className="border-2 px-[5px] mt-[10px]" placeholder="Pool Title"/>
      <button className="border-3 font-bold bg-yellow-400">ADD</button>

    </div>
  )
}