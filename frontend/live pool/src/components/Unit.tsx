import { ProgressBar } from "./progress-bar"

export function Unit(props : any){
  return(
    <div className="border-2 w-full rounded-[10px] px-[5px] bg-white flex flex-col justify-start items-center "> 
      <span className="break-all font-bold text-sm"> hellosjdnjwdqahwdoihqjwidhoqiwhdoqwhdoquwhdouhw</span>
      <div className="flex w-full font-bold text-xs items-center gap-[5px]">
        <ProgressBar progress={props.progress}/>
        {props.progress}%
      </div>
    </div>
  )
}