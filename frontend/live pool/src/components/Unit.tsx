import { ProgressBar } from "./progress-bar"

interface content{
  option : string,
  progress : any,
  onChoose : any,
}

export function Unit(props : content){
  return(
    <div className="border-2 w-full rounded-[10px] px-[5px] bg-white flex flex-col justify-start items-center cursor-pointer" onClick={()=>{props.onChoose()}}> 
      <span className="break-all font-bold text-sm">{props.option}</span>
      <div className="flex w-full font-bold text-xs items-center gap-[5px]">
        <ProgressBar progress={props.progress}/>
        {props.progress}%
      </div>
    </div>
  )
}