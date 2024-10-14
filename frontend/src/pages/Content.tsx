
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Video, FileText } from 'lucide-react';

interface CourseContent{
  title:string;
  duration:string;
  type:string;
  resources?:boolean;
}

const CourseContentItem = ({ title, duration, type, resources = false }:CourseContent) => (
  <div className="flex items-center space-x-2 py-2">
    <Checkbox id={title} />
    <label htmlFor={title} className="flex-grow text-sm">
      {type === 'video' ? <Video className="inline mr-2 w-4 h-4" /> : <FileText className="inline mr-2 w-4 h-4" />}
      {title}
    </label>
    <span className="text-xs text-gray-500">{duration}</span>
    {resources && (
      <button className="text-xs text-blue-600 hover:underline">Resources ▼</button>
    )}
  </div>
);

export default function CourseContentDropdown() {
  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Course content</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="section-2">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex justify-between w-full">
              <span>Section 2: A Full Python Refresher</span>
              <span className="text-sm text-gray-500">0 / 45 | 4hr 44min</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 space-y-2">
              <CourseContentItem title="Introduction to this section" duration="1min" type="video" />
              <CourseContentItem title="Access the code for this section here" duration="1min" type="file" />
              <CourseContentItem title="Variables in Python" duration="8min" type="video" />
              <CourseContentItem title="Coding Exercise 1: Creating variables (Python 3.10)" duration="" type="file" />
              <CourseContentItem title="String formatting in Python" duration="6min" type="video" />
              <CourseContentItem title="Getting user input" duration="5min" type="video" resources />
              <CourseContentItem title="Coding Exercise 2: Asking users for input (Python 3.10)" duration="" type="file" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}