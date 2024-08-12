import { emptySplitApi } from "./emptySplitApi";

const payment = emptySplitApi.injectEndpoints({
    endpoints: builder => ({
        payWithRazorpay: builder.mutation({
            query: (course_fee) => ({
                url: '/payment/buy-course',
                method: 'POST',
                body: {course_fee}
            })
        }),
        verifyPayment: builder.mutation({
            query: (paymentDetails) => ({
                url: '/payment/verify',
                method: 'POST',
                body: paymentDetails
            }),
            invalidatesTags: (result, error, info)=> [{type:'Payment' , id:info.userid}]
        }),
        paymentFailed: builder.mutation({
            query: (paymentDetails)=> ({
                url: '/payment/failed',
                method: 'POST',
                body: paymentDetails
            })
        })
    })
})

export const {usePayWithRazorpayMutation,useVerifyPaymentMutation,usePaymentFailedMutation} = payment;