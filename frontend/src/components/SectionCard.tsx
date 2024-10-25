import { useState } from 'react';
import { Folders } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Video, MoreVertical, Trash, Edit, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from 'axios';
import UpdateContentForm from "@/components/adminupload/UpdateContentForm";
import { useUser } from "@/hooks/useUser";
import { BACKEND_URL } from "@/lib/config";
import { useToast } from '@/hooks/use-toast';

interface FolderCardProps {
  folder: Folders;
  courseId?: string | undefined;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function SectionCard({ folder, onUpdate }: FolderCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { accessToken } = useUser();
  const {toast} = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BACKEND_URL}/content/${folder.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (onUpdate) {
        toast({
          title: "File Deleted",
          description: `Your Video has been deleted sucessfully`,
          duration: 2000,
        })
        onUpdate();
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant:"destructive",
        title: "File Cannot Be Deleted",
        description: `Your Video cannot be deleted. Please Try Again Later!`,
        duration: 2000,
      })
      console.error("Error deleting folder:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm bg-purple-800 text-white overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-tr-lg" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/20 to-transparent rounded-bl-full" />
        
        <div className="relative z-10">
          <p className="text-sm mb-2">Courshala</p>
          <h2 className="text-xl font-bold mb-4">{folder.title}</h2>
          <p className="text-sm">{folder.description}</p>
        </div>
      </CardContent>

      <div className="bg-purple-900 p-4 flex justify-between items-center">
        <Video />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Update</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this folder?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the folder and all its contents.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogTitle>Update Content</DialogTitle>
          <UpdateContentForm
            contentId={folder.id}
            initialData={{
              title: folder.title,
              description: folder.description,
              type: folder.type
            }}
            onUpdateComplete={() => {
              setIsUpdateModalOpen(false);
              toast({
                title: "File Updated",
                description: `Your Video has been updatged sucessfully`,
                duration: 2000,
              })
              if (onUpdate) onUpdate();
            }}
            onCancel={() => setIsUpdateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
