import Header from "@/components/Header"
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/config";
import { Folders } from "@/types/types";
import { useParams } from "react-router-dom";
import { Upload } from 'lucide-react';
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UploadForm } from '@/components/adminupload/AddContentForm';
import axios from "axios";
import SectionCard from '../components/SectionCard';

// interface FolderCardProps {
//   folder: Folders;
//   courseId?: string;
// }

export default function AdminFolderDetail() {
  const [folders, setFolders] = useState<Folders[]>([]);
  const { courseId, folderId } = useParams();
  const { accessToken } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 

  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleUploadComplete = () => {
    setIsDialogOpen(false);
    console.log(isDialogOpen);
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const { data } = await axios.get<any>(`${BACKEND_URL}/content/courses/${courseId}/folders/${folderId}`, {
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
  }, [courseId, folderId, accessToken, refreshTrigger]);

  return (
    <div>
      <Header />
      <div className="flex justify-end mt-4 mr-4">
        <Button 
          variant="ghost" 
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-4 py-2"
          onClick={handleOpenModal}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Content</span>
        </Button>
      </div>

        
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {folders.map((folder) => (
          <SectionCard key={folder.id} folder={folder} />
        ))}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogTitle>Upload Content</DialogTitle>
            {courseId && (
              <UploadForm
                courseId={courseId}
                folderId={folderId}
                onUploadComplete={handleUploadComplete}
                onCancel={handleCloseModal}
              />
            )}
          </DialogContent>
        </Dialog>
    </div>



  )
}