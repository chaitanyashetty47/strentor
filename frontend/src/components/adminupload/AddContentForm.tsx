import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
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
  const { accessToken } = useUser();

  const form = useForm<FormValues>({
    defaultValues: {
      file: null,
      type: 'video',
      title: '',
      description: '',
    },
    mode: 'all', // Enable real-time validation
  });

  const onSubmit = async (data: FormValues) => {
    // Check if form is valid
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

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

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      
      onUploadComplete();
    
      form.reset();
      
    } catch (error) {
      console.error('Error uploading file:', error);
      // Set form error
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input
                  type="file"
                  accept={form.watch('type') === 'pdf' ? '.pdf' : 'video/*'}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          rules={{ required: 'Type is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
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
            className='bg-purple-600 hover:bg-purple-700'
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