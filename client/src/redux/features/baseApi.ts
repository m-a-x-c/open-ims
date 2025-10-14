import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../../utils/config';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
  tagTypes: ['user'],
  endpoints: () => ({})
});
