import { useState } from "react";
import axios from "axios";
import { useUser } from "@/hooks/useUser";
import { Courses } from "@/types/types";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { User, MoreVertical, Trash, Edit, Loader2 } from "lucide-react";
import useTutor from "@/hooks/useTutor";
import { BACKEND_URL } from "@/lib/config";
import UpdateCourseForm from "@/components/adminupload/UpdateCourseForm"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CoursesCardProps {
  course: Courses;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function AdminCourseCard({ course, onUpdate }: CoursesCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // New loading state for delete
  const { accessToken } = useUser();
  const { toast } = useToast();

  const handleDelete = async (e:any) => {
    e.stopPropagation();
    setIsDeleting(true); // Start loading
    try {
      await axios.delete(`${BACKEND_URL}/course/delete/${course.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (onUpdate) {
        toast({
          title: "Success",
          description: "Your course has been deleted",
          duration:2000,
       
        });
        onUpdate(); 
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error Deleting Course. Please Try Again Later!",
        duration:2000,
     
      });
      console.error("Error deleting course:", error);
    } finally {
     
      setIsDeleting(false); // Stop loading
    }
  };

  const { tutor, loading, error } = useTutor(course.createdById);

  return (
    <Link to={`/admin/course/${course.title}/${course.id}`}>
      <Card className="w-[320px] overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative">
            <img
              src={course.imageUrl}
              alt="Course thumbnail"
              className="w-full h-[200px] object-cover"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-1">{course.title}</h2>
          <p className="text-sm font-semibold text-gray-600">
            {course.level} · {course.duration} weeks
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {loading ? (
              <Skeleton className="w-10 h-10 rounded-full" />
            ) : error ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            ) : tutor && tutor.avatarUrl && tutor.avatarUrl.trim() ? (
              <img
                src={tutor.avatarUrl}
                alt={tutor.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    {error
                      ? "Error loading tutor"
                      : tutor
                      ? tutor.name.charAt(0).toUpperCase() + tutor.name.slice(1)
                      : "Unknown tutor"}
                  </p>
                  <p className="text-xs text-gray-500">Tutor</p>
                </>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <MoreVertical className="h-5 w-5 text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsUpdateModalOpen(true); }}>
                <Edit className="mr-2 w-4 h-4" /> Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsDeleteDialogOpen(true); }}>
                <Trash className="mr-2 w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this course?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the course and all its contents.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isDeleting}
              >
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
          <DialogContent 
            className="sm:max-w-[425px] bg-white"
            onClick={(e) => e.stopPropagation()}>
            <DialogTitle>Update Course</DialogTitle>
            <UpdateCourseForm
              courseId={course.id}
              initialData={{
                title: course.title,
                description: course.description,
                level: course.level,
                duration: course.duration
              }}
              onUpdateComplete={() => {
                setIsUpdateModalOpen(false);
                toast({
                  title: "Course Updated",
                  description: "Your course has been updated",
                  duration:2000,
                });
                if (onUpdate) onUpdate();
              }}
              onCancel={() => setIsUpdateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </Card>
    </Link>
  );
}
