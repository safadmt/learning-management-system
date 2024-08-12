import React from 'react'
import { useGetAverageRatingQuery } from '../../api/course'

import StarRatings from 'react-star-ratings';
import Loading from '../Loading';

function AverageRating({courseid,size,spacing}) {
    let content;
    const {data, isLoading, isFetching,isSuccess} = useGetAverageRatingQuery(courseid);
    if(isLoading || isFetching) {
        content = <Loading/>
    }
    if(content) {
        return (
            <div>content</div>
        )
    }else if(isSuccess) {
        return (
        <div className='flex flex-row'>
            <StarRatings starDimension={size ? size : "40px"} starSpacing={spacing ? spacing : '2px'} starRatedColor='#b4690e' rating={data?.avgrating || 0}/>
            <h6 className='font-medium pt-2 pl-2'>{data?.avgrating || 0} Rating</h6>
        </div>
        )
    }
  
}

export default AverageRating