// src/store/api.ts
import { ChatMessage } from '@/types/types';
import { disconnectSocket } from '@/utils/socket';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface PaginatedMessagesResponse {
  messages: ChatMessage[];
  total: number;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include', // ✅ ensures cookies (JWT/session) are sent
  }),
  tagTypes: ['Messages', 'Users'],
  endpoints: builder => ({
    // ✅ Login (server sets cookie, no token in response)
    login: builder.mutation<{ user: any }, { email: string; password: string }>({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),

    loginWithGoogle: builder.mutation<{ user: any }, { googleToken: string }>({
      query: ({ googleToken }) => ({
        url: '/google-login',
        method: 'POST',
        body: { tokenId: googleToken },
      }),
    }),

    register: builder.mutation<
      { user: any },
      { username: string; email: string; password: string }
    >({
      query: body => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    // ✅ Logout (server clears cookie)
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // ✅ disconnect socket after logout
          disconnectSocket();

          // ✅ clear any app state if needed (local user info)
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

      // --- THIS IS THE FIX ---
      // We now provide both a general list tag AND a specific tag for each message.
      providesTags: result => {
        if (result && result.messages) {
          return [
            // Provides a specific tag for each message, e.g., { type: 'Messages', id: '123' }
            ...result.messages.map(msg => ({ type: 'Messages' as const, id: msg.id })),
            // Provides a general tag for the whole list, used for invalidation on creation/deletion.
            { type: 'Messages' as const, id: 'LIST' },
          ];
        }
        // Fallback if there are no messages
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
