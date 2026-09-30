export function ProgressBar(props:any){
  return(
    <div className="w-full border-2 rounded-[10px] h-[15px] my-[5px]">
      <div className="bg-blue-600 rounded-[10px] h-full" style={{ width:`${props.progress}%`}}> </div>
    </div>
  )
}