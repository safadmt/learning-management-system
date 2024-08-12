import React, { useState } from 'react'
import React_Quill from './React_Quill'
import '../qandans.css'
import { IoClose } from 'react-icons/io5'
import { isQuillEmpty } from '../../../../utils/.utils'
import { CgDanger } from "react-icons/cg";

function FormReactQuill({handleSubmit,handleShowReply,}) {

    const [value, setValue] = useState("")
    const [buttonContent, setButtonContent] = useState("Submit")
    const [btndisabled, setBtnDisabled] = useState(false)

    const handleValue = ()=> {
       
        if(isQuillEmpty(value)) {
            setButtonContent(<CgDanger className='mx-auto' size={24} color='red'/>)
            setBtnDisabled(true)
        }
           
        
    }

  return (
    <div className=" bg-white z-0 top-3 border-2 rounded px-4 py-2">
      <div className="grid justify-items-end"><IoClose size={25} className="" onClick={handleShowReply}/></div>
      <form onSubmit={(e)=> handleSubmit(e,value)}>
        <React_Quill placeholder={"e.g. At 02.32, I didn't understand this part, here is a screenshot of what I tried..."}
        value={value} setValue={setValue}/>
      <button className="bg-[#234391] w-full text-center text-white py-2" type='submit'
      onClick={handleSubmit} disabled={btndisabled} onMouseLeave={()=> {setBtnDisabled(false)
      setButtonContent("Submit")}}  onMouseOver={handleValue}>{buttonContent}</button>
      </form>
      
     
    </div>
  )
}

export default FormReactQuill