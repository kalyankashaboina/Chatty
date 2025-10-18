// src/store/api.ts

import { ChatMessage } from '@/types/types';
import { disconnectSocket } from '@/utils/socket';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface PaginatedMessagesResponse {
  messages: ChatMessage[];
  total: number;
}

export interface AuthResponse {
  user: any;
  token: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Messages', 'Users'],
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),

    loginWithGoogle: builder.mutation<AuthResponse, { googleToken: string }>({
      query: ({ googleToken }) => ({
        url: '/google-login',
        method: 'POST',
        body: { googleToken },
      }),
    }),

    register: builder.mutation<AuthResponse, { username: string; email: string; password: string }>(
      {
        query: body => ({
          url: '/register',
          method: 'POST',
          body,
        }),
      }
    ),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          disconnectSocket();
          localStorage.removeItem('user');
        } catch (err) {
          console.error('Logout failed:', err);
        }
      },
    }),

    fetchUsers: builder.query({
      query: () => '/sidebar',
      providesTags: ['Users'],
    }),

    fetchMessages: builder.query<
      PaginatedMessagesResponse,
      { selectedUserId: string; page?: number }
    >({
      query: ({ selectedUserId, page = 1 }) =>
        `/chat/last20?selectedUserId=${selectedUserId}&page=${page}`,
      providesTags: result => {
        if (result && result.messages) {
          return [
            ...result.messages.map(msg => ({ type: 'Messages' as const, id: msg.id })),
            { type: 'Messages' as const, id: 'LIST' },
          ];
        }
        return [{ type: 'Messages' as const, id: 'LIST' }];
      },
    }),

    sendMessage: builder.mutation({
      query: (body: any) => ({
        url: '/chat/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Messages', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useRegisterMutation,
  useLogoutMutation,
  useFetchUsersQuery,
  useFetchMessagesQuery,
  useSendMessageMutation,
} = api;
