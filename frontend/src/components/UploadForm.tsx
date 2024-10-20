import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { BACKEND_URL } from "@/lib/config";
import { useUser } from "@/hooks/useUser";

interface UploadFormProps {
  courseId: string;
  folderId: string | undefined;
  onUploadComplete: () => void;
  onCancel: () => void;
}

export function UploadForm({ courseId, folderId, onUploadComplete, onCancel }: UploadFormProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { accessToken } = useUser();

  const form = useForm({
    defaultValues: {
      file: null as File | null,
      type: 'pdf',
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: any) => {
    if (!data.file) {
      form.setError('file', { type: 'required', message: 'File is required' });
      return;
    }

    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);

    try {
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

      form.reset();
      setUploadProgress(0);
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      // You might want to set an error state here and display it to the user
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={form.watch('type') === 'pdf' ? '.pdf' : 'video/*'}
                  onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
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
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Upload</Button>
        </div>

        {uploadProgress > 0 && (
          <Progress value={uploadProgress} className="w-full" />
        )}
      </form>
    </Form>
  );
}
