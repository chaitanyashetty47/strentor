import AdminHeader from "@/components/AdminHeader"
import FolderCard from "@/components/FolderCard"
import { useState, useEffect } from "react"
import { BACKEND_URL } from "@/lib/config"
import { Folders } from "@/types/types"
import { useParams } from "react-router-dom"
import { useUser } from "@/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import AddFolderForm from "@/components/adminupload/AddFolderForm"
import UpdateFolderForm from "@/components/adminupload/UpdateFolderForm"
import axios from "axios"
import { Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom"


export default function AdminCourseDetail() {
  const [folders, setFolders] = useState<Folders[]>([])
  const { courseId } = useParams()
  const { accessToken } = useUser()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<Folders | null>(null)
  const [folderToUpdate, setFolderToUpdate] = useState<Folders | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = (deletedFolderId: number) => {
    setFolders(prevFolders => prevFolders.filter(folder => folder.id !== deletedFolderId))
  }

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false)
    setSelectedFolder(null)
  }

  const handleUpdate = (folder: Folders) => {
    setSelectedFolder(folder)
    setIsUpdateModalOpen(true)
  }

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<any>(`${BACKEND_URL}/content/courses/${courseId}/folders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setFolders(data)
    } catch (error) {
      setError('An unexpected error occurred');
      setFolders([]);
      console.error("Error fetching Folders:", error)
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFolders()
  }, [folderToUpdate, setFolderToUpdate])

  const handleOpenModal = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
  }

  const handleFolderAdded = () => {
    fetchFolders()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      
      <div className="flex flex-col justify-center items-center min-h-screen">
        <AdminHeader/>
        <div className="text-red-500 mb-4">{error}</div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      {/* Add Button Container */}
      <div className="flex justify-between p-5">
        <div className="ml-4 mt-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 px-2 py-1 bg-transparent"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-black" />
            <span className="text-black">Back</span>
          </Button>
        </div>

        <div className="mr-4 mt-4">
          <Button 
            variant="ghost" 
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-4 py-2"
            onClick={handleOpenModal}
          >
            <Upload className="h-4 w-4" />
            <span>Add Section</span>
          </Button>
        </div>

      </div>

      {/* Cards Grid Container */}

      {folders.length === 0 ? (
        <div className="flex justify-center items-center mt-12 text-xl text-gray-600">
          Get Started and Create a New Section!
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {folders.map((folder) => (
            <div 
              key={folder.id}
              className="transform transition duration-200 hover:scale-[1.02]"
            >
              <FolderCard
                folder={folder}
                courseId={courseId}
                onDelete={() => handleDelete(folder.id)}
                onUpdate={() => handleUpdate(folder)}
              />
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Modals */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Add New Section</DialogTitle>
          <AddFolderForm onClose={handleCloseModal} onCourseAdded={handleFolderAdded} />
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
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