import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { MdMenu } from "react-icons/md";



const Sidebar = ({sidebarList})=> {
    const Navigate = useNavigate();
   const [isShowSidebar, setShowSidebar] = useState(true);
    const [size, setSize] = useState("w-64")
    function updateSidebarWith() {
        
        if(window.innerWidth <= 800) {
            setSize("absolute left-0 top-0 z-0 px-2 h-12");
            setShowSidebar(false);
        }else{
            setSize("w-64 h-screen");
            setShowSidebar(true);
        }
    }
    useEffect(()=> {
        
    window.addEventListener('resize', updateSidebarWith)
    return ()=> {
        window.addEventListener('resize', updateSidebarWith)
    }
    },[])
   const handleCloseBtnClick = ()=> {
    setSize("absolute left-0 top-0 z-0 px-2 h-12")
    setShowSidebar(false)
   }

   const handleMenuBtnClick = ()=> {
    setSize("w-64 h-screen")
    setShowSidebar(true)
   }
    return (
        <div className="relative">

        <div className={`${size} bg-[#191919] sm:pb-4 pt-2 text-white h-[100%]`} id="sidebar">
            <div>
               {!isShowSidebar ? <MdMenu 
               onClick={handleMenuBtnClick}
               className="inline" 
               size={25}/> :
                <IoClose className="inline float-right me-2"
                onClick={handleCloseBtnClick}
                size={25}/> }
            </div>
            {isShowSidebar &&<ul>
            {sidebarList?.map((item,index)=> {
                return <li className="px-4 py-4  hover:bg-gray-700 cursor-pointer " key={index} onClick={()=> Navigate(item.path)}>{item.label}</li>
            })}
            </ul>}
        </div>
        </div>
    )
}

export default Sidebar;