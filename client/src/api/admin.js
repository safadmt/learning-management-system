import { emptySplitApi } from "./emptySplitApi";

const admin = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: ()=> '/admin/categories',

        }),
        getCategoryById: builder.query({
            query: (categoryId)=> `/admin/categories/${categoryId}`,

        })
    })
})

export const {useGetCategoriesQuery,useGetCategoryByIdQuery} = admin