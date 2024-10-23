import { useState, useEffect } from 'react';
import axios from 'axios';
import {useUser} from '@/hooks/useUser';
import { BACKEND_URL } from '@/lib/config';

interface Course {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  openToEveryone: boolean;
  slug: string;
  discordOauthUrl: string;
  certIssued: boolean;
}

interface PurchasedCourse extends Course {
  purchasedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  supabaseId: string;
  role: 'ADMIN' | 'USER' | 'TUTOR';
  purchasedCourses: PurchasedCourse[];
}

export const usePurchases = () => {
  const { user, accessToken } = useUser();
  const [purchases, setPurchases] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        // Fetch the token from the user's session
        const token = accessToken;

        // Send request to backend with the token in the Authorization header
        const { data } = await axios.get<any>(`${BACKEND_URL}/users/purchased`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPurchases(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if(user) fetchPurchases();
  }, [user]); 

  return { purchases, loading, error };
};
