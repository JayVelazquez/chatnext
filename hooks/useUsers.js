import { useState, useEffect } from 'react';

const useUsers = (initialData) => {
  const [users, setUsers] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://665621609f970b3b36c4625e.mockapi.io/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers };
};

export default useUsers;
