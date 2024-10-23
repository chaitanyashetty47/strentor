import { useState, useEffect } from 'react';
import { BACKEND_URL } from '@/lib/config';
import {User} from '@/types/types'

const useTutor = (userId:number) => {
  const [tutor, setTutor] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/users/get/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tutor data');
        }
        const data = await response.json();
        setTutor(data);
        setLoading(false);
      } catch (err:any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTutor();
  }, [userId]);

  return { tutor, loading, error };
};

export default useTutor;