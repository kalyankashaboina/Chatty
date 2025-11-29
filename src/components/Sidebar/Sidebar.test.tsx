import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Sidebar from './Sidebar';
import { logoutUser } from '../../services/authService';
import type { User } from '../../types/mesagetypes';

// --- MOCKS ---

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../services/authService', () => ({
  logoutUser: jest.fn(),
}));

jest.mock('./Sidebar.module.css', () => ({
  sidebar: 'sidebar',
  sidebarHeaderContainer: 'sidebarHeaderContainer',
  sidebarHeader: 'sidebarHeader',
  logoutButton: 'logoutButton',
  searchBox: 'searchBox',
  addUserBtn: 'addUserBtn',
  sidebarListWrapper: 'sidebarListWrapper',
  sidebarList: 'sidebarList',
  singleUser: 'singleUser',
  time: 'time',
  userMessageDetails: 'userMessageDetails',
  lastMessage: 'lastMessage',
}));

// --- DUMMY DATA ---
// 1. Alice: Online, No Pic -> Renders Green Dot (Covers 'isOnline=true' branch)
// 2. Bob: Offline, No Pic -> Renders Gray Dot (Covers 'isOnline=false' branch)
// 3. Charlie: Online, Has Pic -> Icon Hidden by MUI (Covers 'profilePic' truthy branch)
const mockUsers: User[] = [
  { id: '1', username: 'Alice', profilePic: undefined, isOnline: true } as User,
  { id: '2', username: 'Bob', profilePic: undefined, isOnline: false } as User,
  { id: '3', username: 'Charlie', profilePic: 'charlie.jpg', isOnline: true } as User,
];

describe('Sidebar Component', () => {
  const mockSetSelectedUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders sidebar with all users and header elements', () => {
    render(<Sidebar users={mockUsers} selectedUser={null} setSelectedUser={mockSetSelectedUser} />);

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();

    // Check all users are present
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('filters users based on search query', () => {
    render(<Sidebar users={mockUsers} selectedUser={null} setSelectedUser={mockSetSelectedUser} />);

    const searchInput = screen.getByPlaceholderText('Search users...');

    // 1. Filter for "Charlie"
    fireEvent.change(searchInput, { target: { value: 'Charlie' } });
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();

    // 2. Filter for non-existent user
    fireEvent.change(searchInput, { target: { value: 'Zoro' } });
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  test('calls setSelectedUser when a user is clicked', () => {
    render(<Sidebar users={mockUsers} selectedUser={null} setSelectedUser={mockSetSelectedUser} />);

    // Click Alice
    const aliceItem = screen.getByText('Alice').closest('div[role="button"]');
    fireEvent.click(aliceItem!);

    expect(mockSetSelectedUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  test('highlights the selected user', () => {
    render(
      <Sidebar
        users={mockUsers}
        selectedUser={mockUsers[1]} // Bob selected
        setSelectedUser={mockSetSelectedUser}
      />,
    );

    const bobButton = screen.getByText('Bob').closest('div[role="button"]');
    expect(bobButton).toHaveClass('Mui-selected');
  });

  test('handles Logout success flow', async () => {
    (logoutUser as jest.Mock).mockResolvedValueOnce({});

    render(<Sidebar users={mockUsers} selectedUser={null} setSelectedUser={mockSetSelectedUser} />);

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles Logout failure flow', async () => {
    const error = new Error('Network Error');
    (logoutUser as jest.Mock).mockRejectedValueOnce(error);

    render(<Sidebar users={mockUsers} selectedUser={null} setSelectedUser={mockSetSelectedUser} />);

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error during logout:', error);
      expect(window.alert).toHaveBeenCalledWith('Something went wrong while logging out.');
    });
  });

  test('logs to console when Add User is clicked', () => {
    render(<Sidebar users={mockUsers} selectedUser={null} setSelectedUser={mockSetSelectedUser} />);

    fireEvent.click(screen.getByText('+ Add User'));
    expect(console.log).toHaveBeenCalledWith('Add User clicked');
  });

  test('handles window resize effect (setting --vh)', () => {
    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');

    const { unmount } = render(
      <Sidebar users={mockUsers} selectedUser={null} setSelectedUser={mockSetSelectedUser} />,
    );

    expect(setPropertySpy).toHaveBeenCalledWith('--vh', expect.stringContaining('px'));

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(setPropertySpy).toHaveBeenCalledTimes(2);

    unmount();
    setPropertySpy.mockRestore();
  });

  test('renders online status indicator with correct colors', () => {
    render(<Sidebar users={mockUsers} selectedUser={null} setSelectedUser={mockSetSelectedUser} />);

    // MUI Icons render as <svg data-testid="...Icon">
    // Only Alice (No Pic, Online) and Bob (No Pic, Offline) will render icons.
    // Charlie (Has Pic) hides the icon via MUI Avatar behavior.
    const icons = screen.getAllByTestId('FiberManualRecordIcon');

    expect(icons.length).toBe(2);

    // Alice is Online -> Green ('#44b700')
    expect(icons[0]).toHaveStyle('color: #44b700');

    // Bob is Offline -> Gray
    expect(icons[1]).toHaveStyle('color: rgb(128, 128, 128);');
  });
});
