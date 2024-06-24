import { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

const actions = [
  '/mute @user',
  '/ban @user',
  '/title set a title for the current stream',
  '/description set a description for the current stream'
];

const ChatInput = ({ onSendMessage, users }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [filteredActions, setFilteredActions] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const emojiPickerRef = useRef(null);
  const actionsRef = useRef(null);
  const mentionsRef = useRef(null);

  useEffect(() => {
    if (message.includes('/')) {
      setShowActions(true);
      const query = message.split('/').pop();
      setFilteredActions(actions.filter(action => action.includes(query)));
    } else {
      setShowActions(false);
    }

    if (message.includes('@')) {
      setShowMentions(true);
      const query = message.split('@').pop();
      setFilteredUsers(users.filter(user => user.username.includes(query)));
    } else {
      setShowMentions(false);
    }

    if (message.includes(':')) {
      setShowEmojiPicker(true);
    } else {
      setShowEmojiPicker(false);
    }
  }, [message, users]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
      if (mentionsRef.current && !mentionsRef.current.contains(event.target)) {
        setShowMentions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (event, emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    onSendMessage(message);
    setMessage('');
    setShowEmojiPicker(false);
    setShowActions(false);
    setShowMentions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        className="border p-2 w-full rounded border-blue-500"
        placeholder="Type a message..."
      />
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-12 right-0 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {showActions && (
        <div ref={actionsRef} className="absolute bottom-12 left-0 bg-white border border-blue-500 rounded z-10">
          {filteredActions.map(action => (
            <div key={action} className="p-2 hover:bg-blue-100 text-black">
              {action}
            </div>
          ))}
        </div>
      )}
      {showMentions && (
        <div ref={mentionsRef} className="absolute bottom-12 left-0 bg-white border border-blue-500 rounded z-10">
          {filteredUsers.map(user => (
            <div key={user.username} className="p-2 hover:bg-blue-100 text-black">
              @{user.username}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleSend}
        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
