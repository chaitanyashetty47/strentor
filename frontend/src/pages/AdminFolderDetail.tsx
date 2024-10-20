import Header from "@/components/Header"
import FolderCard from "@/components/SectionCard"
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/config";
import { Folders } from "@/types/types";
import { useParams } from "react-router-dom";
import { Upload } from 'lucide-react';
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UploadForm } from '@/components/UploadForm';
import axios from "axios";
import SectionCard from '../components/SectionCard';

interface FolderCardProps {
  folder: Folders;
  courseId?: string;
}

export default function AdminFolderDetail() {
  const [folders, setFolders] = useState<Folders[]>([]);
  const { courseId, folderId } = useParams();
  const { accessToken } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setIsDialogOpen(false);
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogTitle>Upload Content</DialogTitle>
          {courseId && (
            <UploadForm
              courseId={courseId}
              folderId={folderId}
              onUploadComplete={handleUploadComplete}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {folders.map((folder) => (
          <SectionCard key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  )
}