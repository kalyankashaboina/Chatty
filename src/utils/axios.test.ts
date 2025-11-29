// src/utils/axiosInstance.test.ts

import { logoutUser } from '../services/authService';
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './axios';

jest.mock('../services/authService', () => ({
  logoutUser: jest.fn(),
}));

describe('axiosInstance', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mock = new MockAdapter(axiosInstance as any);

    // Mock window.location.href safely
    delete (window as any).location; // first delete it
    (window as any).location = { href: '/' }; // assign a mock
  });

  it('should pass through successful responses', async () => {
    mock.onGet('/test').reply(200, { data: 'ok' });
    const response = await axiosInstance.get('/test');
    expect(response.data).toEqual({ data: 'ok' });
  });

  it('should call logoutUser and redirect on 401', async () => {
    mock.onGet('/private').reply(401);
    await expect(axiosInstance.get('/private')).rejects.toThrow();

    expect(logoutUser).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });

  it('should reject other errors', async () => {
    mock.onGet('/error').reply(500);
    await expect(axiosInstance.get('/error')).rejects.toThrow();
    expect(logoutUser).not.toHaveBeenCalled();
  });
});
