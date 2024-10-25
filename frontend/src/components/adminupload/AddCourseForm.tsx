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
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/config";
import { useUser } from '@/hooks/useUser';
import { Loader2, Upload, Trash2 } from "lucide-react";

interface AddCourseFormProps {
  onClose: () => void;
  onCourseAdded: () => void;
}

const AddCourseForm = ({ onClose, onCourseAdded }: AddCourseFormProps) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm();
  const { accessToken } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null); // State to track file errors

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFileError(null); // Clear any existing file error
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileError('Please select a valid JPG or PNG image.'); // Set file error message
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError(null); // Clear any existing file error
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('level', data.level);
    formData.append('duration', data.duration);
    formData.append('description', data.description);

    if (selectedFile) {
      formData.append('file', selectedFile);
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
      }
    } catch (error) {
      console.error('Error adding course:', error);
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

      <div className="space-y-4">
        {!previewUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors">
            <Input
              type="file"
              accept="image/png, image/jpeg" // Restrict to only PNG and JPEG files
              onChange={handleFileChange}
              className="hidden"
              id="thumbnail-input"
            />

            <label 
              htmlFor="thumbnail-input" 
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                Add course thumbnail
              </span>
              <span className="text-xs text-gray-400">
                JPG or PNG (max. 2MB)
              </span>
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative group w-32">
              <img 
                src={previewUrl} 
                alt="Thumbnail Preview" 
                className="w-32 h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <label 
                htmlFor="thumbnail-input" 
                className="text-sm font-medium text-purple-600 cursor-pointer hover:text-purple-700"
              >
                Change thumbnail
              </label>
              <span className="text-xs text-gray-400">
                JPG or PNG (max. 2MB)
              </span>
            </div>
          </div>
        )}
        {fileError && <span className="text-red-500">{fileError}</span>} {/* Display file error */}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
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
