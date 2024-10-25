// UpdateFolderForm.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/config";
import { useUser } from '@/hooks/useUser';
import { Loader2 } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Folders } from "@/types/types";

interface UpdateFolderFormProps {
  folder: Folders;
  onClose: () => void;
  onFolderUpdated: () => void;
}

const UpdateFolderForm = ({ folder, onClose, onFolderUpdated }: UpdateFolderFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: folder.title,
      description: folder.description || ''
    }
  });
  const { accessToken } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Set initial form values when folder data is available
  useEffect(() => {
    reset({
      title: folder.title,
      description: folder.description || ''
    });
  }, [folder, reset]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const body = JSON.stringify({
      title: data.title,
      description: data.description,
    });

    try {
      const response = await fetch(`${BACKEND_URL}/content/update-subfolder/${folder.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        onFolderUpdated();
        onClose();
        toast({
          title: "Success!",
          description: "Folder updated successfully.",
          duration:2000,        
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "There was a problem updating the folder.",
          duration:2000, 
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      console.error('Error updating folder:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("title", { required: "Title is required" })}
        placeholder="Folder Title"
      />
      {errors.title && <span className="text-red-500">{errors.title.message?.toString()}</span>}

      <Textarea
        {...register("description", { required: "Description is required" })}
        placeholder="Folder Description"
      />
      {errors.description && <span className="text-red-500">{errors.description.message?.toString()}</span>}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className='bg-purple-600 hover:bg-purple-700'>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Folder'
          )}
        </Button>
      </div>
    </form>
  );
};

export default UpdateFolderForm;