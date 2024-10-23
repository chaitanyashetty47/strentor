import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/config";
import { useUser } from '@/hooks/useUser';
import { Loader2 } from "lucide-react";

interface AddCourseFormProps {
  onClose: () => void;
  onCourseAdded: () => void;
}

const AddCourseForm = ({ onClose, onCourseAdded }: AddCourseFormProps) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm();
  const { accessToken } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('level', data.level);
    formData.append('duration', data.duration);
    formData.append('description', data.description);
    if (data.file[0]) {
      formData.append('file', data.file[0]);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/course/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        onCourseAdded();
        onClose();
      } else {
        console.error('Failed to add course');
        // Optionally, you can add error handling here to show an error message to the user
      }
    } catch (error) {
      console.error('Error adding course:', error);
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

      <Controller
        name="level"
        control={control}
        rules={{ required: "Level is required" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger id="levels">
              <SelectValue placeholder="Choose Level" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {errors.level && <span className="text-red-500">{errors.level.message?.toString() || 'Invalid Level'}</span>}

      <Input
        {...register("duration", { required: "Duration is required", pattern: /^\d+$/ })}
        placeholder="Duration (in weeks)"
        type="number"
      />
      {errors.duration && <span className="text-red-500">{errors.duration.message?.toString() || 'Invalid Duration'}</span>}

      <Textarea
        {...register("description", { required: "Description is required" })}
        placeholder="Course Description"
      />
      {errors.description && <span className="text-red-500">{errors.description.message?.toString() || 'Invalid Description'}</span>}

      <Input
        {...register("file")}
        type="file"
        accept="image/*"
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading} className='bg-purple-600 hover:bg-purple-700'>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Add Course'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddCourseForm;