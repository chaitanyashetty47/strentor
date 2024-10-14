import { useState } from 'react';
import { Star } from 'lucide-react';
import { CardContent } from "@/components/ui/card";

export default function Instructor() {
  const [showFullBio, setShowFullBio] = useState(false);

  const fullBio = `My name is Hitesh Choudhary, a retired corporate professional who has seamlessly transitioned into a full-time YouTuber. With a rich history as the founder of LCO (acquired) and a former CTO at iNeuron and Senior Director at PW, I bring a wealth of experience in building software and companies. My journey in the tech world has endowed me with unique insights and expertise, which I am passionate about sharing.

  On YouTube, I manage two thriving channels—one boasting 1 million subscribers and the other with 300,000—demonstrating my ability to connect with and educate a vast audience. My travels to 39 countries have enriched my understanding and provided a global perspective that I incorporate into my content.

  My hallmark is making the toughest topics easy to understand, a skill that has earned me a dedicated following. I am committed to educating and inspiring a diverse audience worldwide, making complex subjects accessible and engaging. Join me on Udemy, where I bring my extensive knowledge, practical experience, and unique teaching style to help you master new skills and advance your career.`;

  const shortBio = fullBio.split('.')[0] + '.';

  return (
    <CardContent className="p-6">
      <h2 className="text-2xl font-bold mb-4">Instructor</h2>
      <div className="flex items-start mb-4">
        <img src="/api/placeholder/100/100" alt="Hitesh Choudhary" className="w-24 h-24 rounded-full mr-4" />
        <div>
          <h3 className="text-xl font-semibold">Hitesh Choudhary</h3>
          <p className="text-gray-600">A teacher who loves to teach about Technology</p>
          <div className="flex items-center mt-2">
            <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
            <span className="ml-1 font-semibold">4.8 Instructor Rating</span>
          </div>
          <p className="text-gray-600">1,842 Reviews • 9,266 Students • 1 Course</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">
        {showFullBio ? fullBio : shortBio}
      </p>
      <button
        className="text-blue-600 hover:underline"
        onClick={() => setShowFullBio(!showFullBio)}
      >
        {showFullBio ? 'Show less' : 'Show more'}
      </button>
    </CardContent>
  );
}