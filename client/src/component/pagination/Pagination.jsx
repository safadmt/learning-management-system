import React, { useEffect } from 'react'
import './pagination.css'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage } from '../../api/slices/globalSlice'

function Pagination() {

    const dispatch = useDispatch();
    
    const {totalpages} = useSelector(state=> state.globalSlice);
    const {currentpage} = useSelector(state=> state.globalSlice)
    
    useEffect(()=> {
      console.log(currentpage)
    },[currentpage])
    const handlePageClick = (e)=> {
        dispatch(setCurrentPage(e.selected + 1))
      
        console.log("hell osfad")
    }
  return (
    <div id='paginationdiv'>
        <ReactPaginate 
        initialPage={0}
        previousClassName='nextprevious'
        nextClassName='nextprevious'
        activeClassName='currentpage'
        pageClassName='pages'
        className='pagination'
        breakLabel="..."
        nextLabel="next >" 
        pageCount={totalpages} 
        pageRangeDisplayed={3} 
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        previousLabel="< previous"
        renderOnZeroPageCount={null}/>
    </div>
  )
}

export default Pagination