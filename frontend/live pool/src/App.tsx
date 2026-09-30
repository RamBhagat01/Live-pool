import {Unit} from "./components/Unit"
import {Add} from "./components/top-add"

export default function App() {
  return(
    <div className="flex w-screen h-screen  justify-center items-center">

      <div id={"card"} className=" bg-gray-100 w-[300px] border-4 justify-center items-center px-[20px] py-[20px]">
        <Add></Add>

        <div className="border-3 rounded-[10px] px-[5px] py-[10px] mt-[20px] bg-gray-400 flex flex-col gap-[5px]">
          <span className="font-bold break-all">What is the question??jnnjjjsndjsjdjsdjsndjnsjdnsjdjsndjsndjnsdjnsjdn</span>
          <Unit progress={25}></Unit>
          <Unit progress={50}></Unit>
          <Unit progress={100}></Unit>  
        </div>

      </div>
    
    </div>   
  )
}

