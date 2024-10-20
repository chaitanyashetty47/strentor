import Header from "@/components/Header"
import FolderCard from "@/components/FolderCard"
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/config";
import { Folders } from "@/types/types";
import { useParams } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import axios from "axios";

export default function AdminfolderDetail() {
  const [folders, setFolders] = useState<Folders[]>([]);
  const {courseId} = useParams();
  const {  accessToken } = useUser();
  const [folderToUpdate, setFolderToUpdate] = useState<Folders | null>(null);

  const handleDelete = (deletedFolderId: number) => {
    setFolders(prevFolders => prevFolders.filter(folder => folder.id !== deletedFolderId));
  };

  const handleUpdate = (folderToUpdate: Folders) => {
    setFolderToUpdate(folderToUpdate);
    // Open update dialog or navigate to update page
  };
  
  // Fetch Folders from backend
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        // Send request to backend with the token in the Authorization header
        const { data } = await axios.get<any>(`${BACKEND_URL}/content/courses/${courseId}/folders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        setFolders(data);
      } catch (error) {
        console.error("Error fetching Folders:", error);
      }
    };

    fetchFolders();
  }, []);
  return (
    <div>
       <Header />
       <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} courseId={courseId} 
          onDelete={() => handleDelete(folder.id)}  onUpdate={() => handleUpdate(folder)}/>
        ))}
      </div>
    </div>
  )
}