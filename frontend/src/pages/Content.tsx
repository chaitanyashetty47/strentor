import React, { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Video, FileText, Folder } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import axios from 'axios';

import { useRecoilState } from 'recoil';
import { selectedVideoState, VideoContent } from '../recoil/atoms';

interface Content {
  id: number;
  type: string;
  title: string;
  hidden: boolean;
  description: string;
  thumbnail: string | null;
  parentId: number | null;
}

interface Course {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  slug: string;
  content: { courseId: number; contentId: number; content: Content }[];
}

const ContentIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'video':
      return <Video className="inline mr-2 w-4 h-4" />;
    case 'pdf':
      return <FileText className="inline mr-2 w-4 h-4" />;
    case 'folder':
      return <Folder className="inline mr-2 w-4 h-4" />;
    default:
      return null;
  }
};

const CourseContentItem = ({ content }: { content: Content }) => (
  <div className="flex items-center space-x-2 py-2">
    <Checkbox id={content.id.toString()} />
    <label htmlFor={content.id.toString()} className="flex-grow text-sm">
      <ContentIcon type={content.type} />
      {content.title}
    </label>
  </div>
);

const CourseContentDropdown = ({ courseId }: { courseId: number }) => {

  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoState);

  const handleSelectContent = (content: VideoContent) => {
    if (content.type === 'video') {
      setSelectedVideo(content); // Update the selected video in Recoil
    }
  };
  //changes above

  const { accessToken } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseContents = async () => {
      try {
        const { data } = await axios.get<Course>(`http://localhost:3000/course/${courseId}/content`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCourse(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContents();
  }, [courseId, accessToken]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>No course data available</div>;

  const organizeContent = (contents: Course['content']) => {
    const rootItems: Content[] = [];
    const childrenMap: { [key: number]: Content[] } = {};

    contents.forEach(({ content }) => {
      if (content.parentId === null) {
        rootItems.push(content);
      } else {
        if (!childrenMap[content.parentId]) {
          childrenMap[content.parentId] = [];
        }
        childrenMap[content.parentId].push(content);
      }
    });

    const sortedRootItems = rootItems.sort((a, b) => a.id - b.id);

    return { rootItems: sortedRootItems, childrenMap };
  };

  const { rootItems, childrenMap } = organizeContent(course.content);

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Course content: {course.title}</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {rootItems.map((item) => (
          <AccordionItem key={item.id} value={`section-${item.id}`}>
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex justify-between w-full">
                <span><ContentIcon type={item.type} />{item.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 space-y-2">
                {childrenMap[item.id]?.map((child) => (
                  // <CourseContentItem key={child.id} content={child} />
                  <div
                    key={child.id}
                    onClick={() => handleSelectContent(child)}
                  >
                    <CourseContentItem content={child} />
                  </div>

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