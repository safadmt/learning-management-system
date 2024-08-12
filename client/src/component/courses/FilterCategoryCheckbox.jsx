import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { filterCategoriesCheckbox } from '../../api/slices/globalSlice';

function FilterCategoryCheckbox({categorydata,isSuccess}) {
    const dispatch = useDispatch();

    const [filterCheckbox, setFilterCheckbox] = useState([])
    const {categoryId} = useSelector(state=> state.globalSlice)
    const [searchParams, setSearchParams] = useSearchParams()
    const { filtercategories } = useSelector(state=> state.globalSlice)
   


    
  if(categorydata.isSuccess && categorydata?.categories.length > 0) {
    return (
    <div className='pt-2'>
                <h5 className='font-medium text-xl'>Category</h5>
                <ul className='hover:cursor-pointer ps-2 font-medium'>
                    {categorydata.categories.map((category,index)=> (
                        <li key={index}> 
                        <input type='checkbox' 
                        value={category._id}
                        checked={filtercategories.some(c=> c.id === category._id)}
                        onChange={(e)=> 
                            dispatch(filterCategoriesCheckbox({id: e.target.value,cname:category.category_name}))}
                        className='mr-2'/>{category.category_name}</li>
                    ))}
                </ul>
            </div>
  )
                    }
}

export default FilterCategoryCheckbox