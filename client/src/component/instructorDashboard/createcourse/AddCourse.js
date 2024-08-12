import React, { useEffect } from 'react'

import { useGetCategoriesQuery } from '../../../api/admin'
import Loading from '../../Loading';
import ErrorPage from '../../../pages/ErrorPage';
import InputSelect from '../../InputSelect';

function AddCourse({course_details,fileChange, inputChange,fileErr}) {
    let content;
    const {data:categories,isSuccess,isLoading,isError} = useGetCategoriesQuery();
    
    useEffect(()=> {
        if(isLoading) {
            content = <Loading/>
        }else if (isError) {
            content = <ErrorPage/>
        }
    },[isError,isLoading])
    const handleFileChange = (e)=> {
        fileChange(e)
    }
    const handleChange = (e)=> {
        inputChange(e)
    }
     
    return (
        <div>

        
        {content ? content : isSuccess && <div>
            
        <label className='font-medium text-lg'>Title</label>
        <input type='text' name='title' value={course_details?.title}
        onChange={handleChange}
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full my-2 rounded' />

        <label className='font-medium text-lg'>Description</label>
        <input type='text' name='description' value={course_details?.description}
        onChange={handleChange}
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full my-2 rounded' />
       
        <div className={course_details?.fee_status === "Paid" ? 'grid grid-cols-4' : 'my-2'}>
        
        <div className='col-span-3 '> 
        <label className='font-medium text-lg'>Fee status</label>
            <select className='px-2 py-2 border-2 border-gray-400 text-xl w-full rounded'
            value={course_details.fee_status ? course_details.fee_status : ""}
            name='fee_status' onChange={handleChange}>
                <option value={""}>Select</option>
                <option value={"Free"}>Free</option>
                <option value={"Paid"}>Paid</option>
            </select>
        </div>
        { course_details.fee_status === "Paid" && <div className=''>
            <label className='font-medium text-lg'>Course Fee</label>
            <input type='number' name='course_fee' value={course_details?.course_fee} onChange={handleChange}
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full rounded' />
        </div>}
        </div>
       
        
        <label className='font-medium text-lg'>Categories</label>
        <InputSelect categories={categories} 
        currentvalue={course_details.category} handleChange={handleChange}/>

        <label className='font-medium text-lg'>Course_image</label>
        {fileErr && <p className='bg-red-600'>{fileErr}</p>}
        <input type='file' name='course_image' onChange={handleFileChange}
            className='px-2 py-2 border-2 border-gray-400 text-xl w-full my-2 rounded' />

    </div>}
    </div>
    )
}

export default AddCourse