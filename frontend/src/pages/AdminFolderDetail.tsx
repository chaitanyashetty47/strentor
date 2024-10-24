import AdminHeader from "@/components/AdminHeader";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/config";
import { Folders } from "@/types/types";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from 'lucide-react';
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UploadForm } from '@/components/adminupload/AddContentForm';
import axios from "axios";
import SectionCard from '../components/SectionCard';

export default function AdminFolderDetail() {
  const [folders, setFolders] = useState<Folders[]>([]);
  const { courseId, folderId } = useParams();
  const { accessToken } = useUser();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleUploadComplete = () => {
    setIsAddModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Folders[]>(`${BACKEND_URL}/content/courses/${courseId}/folders/${folderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFolders(data);
      } catch (error) {
        setError('An unexpected error occurred');
        setFolders([]);
        console.error("Error fetching Courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [courseId, folderId, accessToken, refreshTrigger]);

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
        <AdminHeader />
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
    <div>
      <AdminHeader />

      
      <div className="flex justify-between mx-auto my-auto">
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
            <span>Upload Content</span>
          </Button>
        </div>

      </div>
      

      {/* Conditional Rendering for Folders */}
      {folders.length === 0 ? (
        <div className="flex justify-center items-center mt-12 text-xl text-gray-600">
          Get Started and Create a New Content!
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
            {folders.map((folder) => (
              <div className="w-full" key={folder.id}>
                <SectionCard
                  folder={folder}
                  onUpdate={() => setRefreshTrigger(prev => prev + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Upload */}
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
  );
}
