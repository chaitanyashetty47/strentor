import React, { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Video, FileText } from 'lucide-react';
import {useUser} from '@/hooks/useUser';
import axios from 'axios';

interface CourseContent {
  id: number;
  title: string;
  type: string;
  children?: CourseContent[]; // Handle immediate children
}

const CourseContentItem = ({ id, title, type }: CourseContent) => (
  <div className="flex items-center space-x-2 py-2">
    <Checkbox id={id.toString()} />
    <label htmlFor={id.toString()} className="flex-grow text-sm">
      {type === 'video' ? <Video className="inline mr-2 w-4 h-4" /> : <FileText className="inline mr-2 w-4 h-4" />}
      {title}
    </label>
  </div>
);

const CourseContentDropdown = ({ courseId }: { courseId: number }) => {
  const { accessToken } = useUser();
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseContents = async () => {
      try {

        // Fetch the token from the user's session
        const token = accessToken;

        // Send request to backend with the token in the Authorization header
        const { data } = await axios.get<CourseContent[]>('http://localhost:3000/course/2/content', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setContents(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContents();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Course content</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {contents.map((content) => (
          <AccordionItem key={content.id} value={`section-${content.id}`}>
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex justify-between w-full">
                <span>{content.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 space-y-2">
                {content.children?.map((child) => (
                  <CourseContentItem key={child.id} id={child.id} title={child.title} type={child.type} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseContentDropdown;
