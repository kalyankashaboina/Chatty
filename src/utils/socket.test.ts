// We mock the library at the top level
jest.mock('socket.io-client');

describe('Socket Utility', () => {
  // Variable to hold the re-imported module
  let socketUtils: typeof import('./socket');

  let mockSocket: any;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // 1. Reset cache so we can test singleton logic and environment variables afresh
    jest.resetModules();

    // 2. Setup Console Spies
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // 3. Define the Mock Socket object structure
    mockSocket = {
      id: 'mock-socket-id',
      on: jest.fn(),
      disconnect: jest.fn(),
      io: {
        on: jest.fn(),
      },
      connected: true,
    };

    // 4. CRITICAL: Re-import the mock library and configure it.
    // Use dynamic import instead of require
    const { io } = await import('socket.io-client');
    (io as jest.Mock).mockReturnValue(mockSocket);

    // 5. Re-import the utility under test dynamically
    socketUtils = await import('./socket');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization & Singleton', () => {
    it('should initialize socket with default URL if env is missing', async () => {
      // Ensure global importMeta is undefined for this test
      const originalImportMeta = (global as any).importMeta;
      (global as any).importMeta = undefined;

      const { io } = await import('socket.io-client');

      const socket = socketUtils.initializeSocket();

      expect(io).toHaveBeenCalledWith(
        'https://chatty-server-uhm7.onrender.com',
        expect.objectContaining({
          transports: ['websocket'],
          withCredentials: true,
          reconnection: true,
        }),
      );
      expect(socket).toBe(mockSocket);

      // Restore global
      (global as any).importMeta = originalImportMeta;
    });

    it('should use VITE_API_URL if present', async () => {
      // 1. Reset modules again to ensure SOCKET_URL is re-evaluated
      jest.resetModules();

      // 2. Re-configure the io mock for this new module context
      const { io } = await import('socket.io-client');
      (io as jest.Mock).mockReturnValue(mockSocket);

      // 3. Mock the environment variable
      (global as any).importMeta = {
        env: { VITE_API_URL: 'wss://custom-api.com' },
      };

      // 4. Re-import the module to pick up the env var
      const freshSocketUtils = await import('./socket');
      freshSocketUtils.initializeSocket();

      expect(io).toHaveBeenCalledWith('wss://custom-api.com', expect.anything());

      // Cleanup
      delete (global as any).importMeta;
    });

    it('should return the existing socket instance on subsequent calls', async () => {
      const socket1 = socketUtils.initializeSocket();
      const socket2 = socketUtils.initializeSocket();

      const { io } = await import('socket.io-client');
      expect(io).toHaveBeenCalledTimes(1);
      expect(socket1).toBe(socket2);
    });
  });

  describe('Getters & Disconnect', () => {
    it('getSocket should return null before initialization', () => {
      expect(socketUtils.getSocket()).toBeNull();
    });

    it('getSocket should return socket after initialization', () => {
      const initSocket = socketUtils.initializeSocket();
      expect(socketUtils.getSocket()).toBe(initSocket);
    });

    it('disconnectSocket should disconnect and set socket to null', () => {
      socketUtils.initializeSocket();

      socketUtils.disconnectSocket();

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(socketUtils.getSocket()).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith('🔌 Socket manually disconnected');
    });

    it('disconnectSocket should do nothing if socket is already null', () => {
      socketUtils.disconnectSocket();
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('Event Listeners', () => {
    // Maps to store the event callbacks registered by the application
    let eventMap: Record<string, (...args: any[]) => void>;
    let ioEventMap: Record<string, (...args: any[]) => void>;

    beforeEach(() => {
      eventMap = {};
      ioEventMap = {};

      // Capture the callbacks passed to socket.on(...)
      mockSocket.on.mockImplementation((event: string, cb: (...args: any[]) => void) => {
        eventMap[event] = cb;
      });

      // Capture the callbacks passed to socket.io.on(...)
      mockSocket.io.on.mockImplementation((event: string, cb: (...args: any[]) => void) => {
        ioEventMap[event] = cb;
      });

      // Initialize to trigger the registrations
      socketUtils.initializeSocket();
    });

    it('should log on "connect"', () => {
      expect(eventMap['connect']).toBeDefined();
      eventMap['connect']();
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Socket connected:', 'mock-socket-id');
    });

    it('should warn on "disconnect"', () => {
      expect(eventMap['disconnect']).toBeDefined();
      eventMap['disconnect']('transport close');
      expect(consoleWarnSpy).toHaveBeenCalledWith('❌ Disconnected:', 'transport close');
    });

    it('should log error on "connect_error"', () => {
      expect(eventMap['connect_error']).toBeDefined();
      const err = new Error('Auth failed');
      eventMap['connect_error'](err);
      expect(consoleErrorSpy).toHaveBeenCalledWith('🚫 Connection error:', 'Auth failed');
    });

    it('should log on "reconnect_attempt"', () => {
      expect(ioEventMap['reconnect_attempt']).toBeDefined();
      ioEventMap['reconnect_attempt'](1);
      expect(consoleLogSpy).toHaveBeenCalledWith('⚡ Reconnecting, attempt #1');
    });

    it('should log on "reconnect"', () => {
      expect(ioEventMap['reconnect']).toBeDefined();
      ioEventMap['reconnect'](2);
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Reconnected after 2 attempt(s)');
    });

    it('should error on "reconnect_error"', () => {
      expect(ioEventMap['reconnect_error']).toBeDefined();
      const err = new Error('Timeout');
      ioEventMap['reconnect_error'](err);
      expect(consoleErrorSpy).toHaveBeenCalledWith('❗ Reconnect error:', 'Timeout');
    });

    it('should error on "reconnect_failed"', () => {
      expect(ioEventMap['reconnect_failed']).toBeDefined();
      ioEventMap['reconnect_failed']();
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Permanent reconnect failure.');
    });
  });
});
