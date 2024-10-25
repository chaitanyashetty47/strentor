import { useState } from 'react';
import { Folders } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, MoreVertical, Trash, Edit, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from "@/hooks/useUser";
import { BACKEND_URL } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';

interface FolderCardProps {
  folder: Folders;
  courseId?: string | undefined;
  onDelete?: () => void;
  onUpdate?: (folder: Folders) => void;
}

export default function FolderCard({ folder, onDelete, onUpdate, courseId }: FolderCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State for loading spinner
  const { accessToken } = useUser();
  const {toast} = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BACKEND_URL}/content/delete-subfolder/${folder.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (onDelete) {
        toast({
          title: "File Deleted",
          description: `Your Video has been deleted sucessfully`,
          duration: 2000,
        })
        onDelete();
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant:"destructive",
        title: "File Cannot Be Deleted",
        description: `Your Folder cannot be deleted. Please Try Again Later!`,
        duration: 2000,
      })
      console.error("Error deleting folder:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm bg-purple-800 text-white overflow-hidden">
      <Link to={`/admin/course/${courseId}/folder/${folder.id}`}>
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-tr-lg" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/20 to-transparent rounded-bl-full" />

          <div className="relative z-10">
            <p className="text-sm mb-2">Courshala</p>
            <h2 className="text-xl font-bold mb-4">{folder.title}</h2>
            <p className="text-sm">{folder.description}</p>
          </div>
        </CardContent>
      </Link>
      <div className="bg-purple-900 p-4 flex justify-between items-center">
        <Folder />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdate?.(folder)}>
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
    </Card>
  );
}
