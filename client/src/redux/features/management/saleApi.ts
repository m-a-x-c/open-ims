import { baseApi } from "../baseApi";

const saleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSale: builder.query({
      query: (query) => ({
        url: '/sales',
        method: 'GET',
        params: query
      }),
      providesTags: ['sale']
    }),
    createSale: builder.mutation({
      query: (payload) => ({
        url: '/sales',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['sale', 'product']
    }),
    deleteSale: builder.mutation({
      query: (id) => ({
        url: `/sales/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['sale']
    }),
    updateSale: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/sales/${id}`,
        method: 'PATCH',
        body: payload
      }),
      invalidatesTags: ['sale']
    }),
  })
})

export const {
  useGetAllSaleQuery,
  useCreateSaleMutation,
  useDeleteSaleMutation,
  useUpdateSaleMutation } = saleApi
