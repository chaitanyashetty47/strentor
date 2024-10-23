import { useState } from 'react';
import { useForm} from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from 'react-router-dom';
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/config";
import { useUser } from '@/hooks/useUser';
import { Loader2 } from "lucide-react";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface AddFolderFormProps {
  onClose: () => void;
  onCourseAdded: () => void;
}

const AddFolderForm = ({ onClose, onCourseAdded }: AddFolderFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { accessToken } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { courseId } = useParams();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    

    const body = JSON.stringify({
      title: data.title,
      description: data.description,
    });
  

    try {
      const response = await fetch(`${BACKEND_URL}/content/create-subfolder/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        onCourseAdded();
        onClose();
        toast({
          title: "Success!",
          description: "Course created successfully.",
        })
      } else {
        console.error('Failed to add folder');
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        onClose();
        // Optionally, you can add error handling here to show an error message to the user
      }
    } catch (error) {
      console.error('Error adding folder:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      onClose();
      // Optionally, you can add error handling here to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("title", { required: "Title is required" })}
        placeholder="Course Title"
      />
      {errors.title && <span className="text-red-500">{errors.title.message?.toString() || 'Invalid title'}</span>}


      <Textarea
        {...register("description", { required: "Description is required" })}
        placeholder="Course Description"
      />
      {errors.description && <span className="text-red-500">{errors.description.message?.toString() || 'Invalid Description'}</span>}


      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Add Section'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddFolderForm;