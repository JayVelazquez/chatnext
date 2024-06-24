import { useState } from 'react';
import { useRouter } from 'next/router';
import useUsers from '../hooks/useUsers';
import ChatInput from '../components/ChatInput';
import ProfilePictureUpload from '../components/ProfilePictureUpload'; 

const UsersPage = ({ initialData }) => {
  const { users: initialUsers, loading, error } = useUsers(initialData);
  const [search, setSearch] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const router = useRouter();

  // Filtered users state
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);

  // Function to handle search input change
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    // Filter users based on search term
    const filtered = initialUsers.filter(user =>
      user.username.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  // Function to handle pagination
  const handlePageChange = (page) => {
    router.push(`/?page=${page}`);
  };

  // Function to handle sending chat messages
  const handleSendMessage = (message) => {
    setChatMessages([...chatMessages, { text: message, id: Date.now() }]);
  };

  // Function to render chat message
  const renderMessage = (message) => {
    const taggedUser = initialUsers.find(user => message.text.includes(`@${user.username}`));
    const isTagged = taggedUser ? ` bg-yellow-200` : '';
    const formattedText = message.text.replace(/:\w+:/g, (match) => {
      const emoji = match.slice(1, -1);
      return `<img src="https://twemoji.maxcdn.com/2/72x72/${emoji}.png" alt="${emoji}" class="inline-block w-6 h-6" />`;
    });

    return (
      <div key={message.id} className={`p-2 border-b${isTagged}`}>
        <span dangerouslySetInnerHTML={{ __html: formattedText }} />
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <ProfilePictureUpload />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email/username"
          value={search}
          onChange={handleSearch}
          className="border p-2 w-full rounded border-blue-500 focus:outline-none focus:border-blue-700"
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <table className="min-w-full table-auto mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className="px-4 py-2 border mx-1 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {page}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Chat</h2>
        <div className="border p-4 mb-2">
          {chatMessages.map(renderMessage)}
        </div>
        <ChatInput onSendMessage={handleSendMessage} users={initialUsers} />
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const res = await fetch('https://665621609f970b3b36c4625e.mockapi.io/users');
  const initialData = await res.json();

  return { props: { initialData } };
};

export default UsersPage;


