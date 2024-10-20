import React from 'react';
import { MoreVertical, Trash } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/config';
import { useUser } from '@/hooks/useUser';

interface ContentActionsProps {
  contentId: string;
  onSuccess: () => void; // To refresh the content list after deletion
}

const ContentActions: React.FC<ContentActionsProps> = ({ contentId, onSuccess }) => {
  const { accessToken } = useUser();

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/content/${contentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onSuccess();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  return (
    <div className="relative">
      <MoreVertical className="cursor-pointer" />

      <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50">
        <button
          onClick={handleDelete}
          className="flex items-center w-full p-2 hover:bg-red-600 hover:text-white"
        >
          <Trash className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

export default ContentActions;
