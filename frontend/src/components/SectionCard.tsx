import { useState } from 'react';
import { Folders } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, MoreVertical, Trash, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from 'axios';
import { Link , useParams} from 'react-router-dom';
import { useUser } from "@/hooks/useUser";

interface FolderCardProps {
  folder: Folders;
  courseId?: string | undefined;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function SectionCard({ folder, onDelete, onUpdate }: FolderCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {accessToken} = useUser();
  //const {courseId} = useParams();

  const handleDelete = async () => {
    try {
      //console.log(`http://localhost:3000/content/${folder.id}`)
      await axios.delete(`http://localhost:3000/content/${folder.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (onDelete) {
        onDelete();
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  return (
    <Card className="w-full max-w-sm bg-blue-600 text-white overflow-hidden">
      {/* <Link to = {`/course/${course.title}/${course.id}`} > */}
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-tr-lg" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/20 to-transparent rounded-bl-full" />
        
        <div className="relative z-10">
          <p className="text-sm mb-2">Strentor</p>
          <h2 className="text-xl font-bold mb-4">{folder.title}</h2>
          <p className="text-sm">{folder.description}</p>
        </div>
      </CardContent>
      {/* </Link> */}
      <div className="bg-blue-700 p-4 flex justify-between items-center">
        <Folder />
        
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              { 
                <DropdownMenuItem onClick={onUpdate}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Update</span>
                </DropdownMenuItem>
              }
              {
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              }
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
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      
    </Card>
  );
}