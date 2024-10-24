import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Upload, X } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";
import { useUser } from "@/hooks/useUser";

interface UploadFormProps {
  courseId: string;
  folderId: string | undefined;
  onUploadComplete: () => void;
  onCancel: () => void;
}

interface FormValues {
  file: File | null;
  type: string;
  title: string;
  description: string;
}

export function UploadForm({ courseId, folderId, onUploadComplete, onCancel }: UploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { accessToken } = useUser();

  const form = useForm<FormValues>({
    defaultValues: {
      file: null,
      type: 'video',
      title: '',
      description: '',
    },
    mode: 'all',
  });

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Create preview URL for video
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('file', file);

      // Auto-fill title from filename
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      form.setValue('title', fileName);
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      form.setValue('file', null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      if (data.file) formData.append('file', data.file);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('type', data.type);

      const response = await fetch(`${BACKEND_URL}/content/upload/${courseId}/${folderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      onUploadComplete();
      form.reset();
      setPreviewUrl(null);

    } catch (error) {
      console.error('Error uploading file:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Upload failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md"> {/* Minimized width */}
        <FormField
          control={form.control}
          name="file"
          rules={{ 
            required: 'File is required',
            validate: (value) => {
              if (!value) return 'File is required';
              return true;
            }
          }}
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>File *</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {!previewUrl ? (
                    <div
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                        >
                          <span>Upload a video</span>
                          <Input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleFileChange(file);
                            }}
                            {...field}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">MP4, WebM, or Ogg up to 10GB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <video
                        className="w-full rounded-lg"
                        controls
                        src={previewUrl}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleFileChange(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="title"
          rules={{ 
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ 
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Add Content'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UploadForm;
