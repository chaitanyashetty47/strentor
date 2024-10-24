import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import a Textarea component for description
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";
import { useUser } from "@/hooks/useUser";

interface UpdateCourseFormProps {
  courseId: number;
  initialData: {
    title: string;
    description: string;
    level: string;
    duration: string;
  };
  onUpdateComplete: () => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  description: string;
  level: string;
  duration: string;
}

export default function UpdateCourseForm({ courseId, initialData, onUpdateComplete, onCancel }: UpdateCourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useUser();

  const form = useForm<FormValues>({
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      level: initialData.level,
      duration: initialData.duration,
    },
    mode: 'all',
  });

  const onSubmit = async (data: FormValues) => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/course/update/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          level: data.level,
          duration: data.duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      onUpdateComplete();
    } catch (error) {
      console.error('Error updating course:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Update failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
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

        {/* Description Field (Textarea) */}
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
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Level Field */}
        <FormField
          control={form.control}
          name="level"
          rules={{ required: 'Level is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level *</FormLabel>
              <FormControl>
                <Input placeholder="Enter level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration Field */}
        <FormField
          control={form.control}
          name="duration"
          rules={{ 
            required: 'Duration is required',
            min: {
              value: 1,
              message: 'Duration must be at least 1 week'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (weeks) *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter duration in weeks" {...field} />
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
                Updating...
              </>
            ) : (
              'Update Course'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
