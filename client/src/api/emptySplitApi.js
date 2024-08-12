import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../config'
import localforage from 'localforage'

export const emptySplitApi = createApi({
    reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL , credentials:'include'}),
  
  tagTypes: ['User','Course','Comment','Wishlist','Payment','Question', 'Reply'],
  endpoints: builder => ({})
})



