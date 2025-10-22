import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: '/users/login',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['user']
    }),

    register: builder.mutation({
      query: (payload) => ({
        url: '/users/register',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['user']
    }),
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi
