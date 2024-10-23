import Header from "@/components/Header"
import FolderCard from "@/components/FolderCard"
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/config";
import { Folders } from "@/types/types";
import { useParams } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddFolderForm from "@/components/adminupload/AddFolderForm";
import UpdateFolderForm from "@/components/adminupload/UpdateFolderForm";
import axios from "axios";

export default function AdminCourseDetail() {
  const [folders, setFolders] = useState<Folders[]>([]);
  const {courseId} = useParams();
  const {  accessToken } = useUser();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folders | null>(null);
  const [folderToUpdate, setFolderToUpdate] = useState<Folders | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = (deletedFolderId: number) => {
    setFolders(prevFolders => prevFolders.filter(folder => folder.id !== deletedFolderId));
  };


  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedFolder(null);
  };

  const handleUpdate = (folder: Folders) => {
    setSelectedFolder(folder);
    setIsUpdateModalOpen(true)
  };



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

    // Fetch Folders from backend
    useEffect(() => {
      fetchFolders();
    }, [folderToUpdate,setFolderToUpdate]);

  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleFolderAdded = () => {
    fetchFolders(); // Refresh the folder list
  };
  

  return (
    <div>
       <Header />
       <div className="flex justify-end mt-4 mr-4">
       <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleOpenModal}
        >
          Add New Section
        </Button>
       </div>
       <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} courseId={courseId} 
          onDelete={() => handleDelete(folder.id)}  onUpdate={() => handleUpdate(folder)}/>
        ))}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogTitle>Add New Course</DialogTitle>
          <AddFolderForm onClose={handleCloseModal} onCourseAdded={handleFolderAdded} />
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogTitle>Update Folder</DialogTitle>
          {selectedFolder && (
            <UpdateFolderForm
              folder={selectedFolder}
              onClose={handleCloseUpdateModal}
              onFolderUpdated={fetchFolders}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}