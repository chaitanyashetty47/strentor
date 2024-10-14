import { Star } from 'lucide-react';


const testimonials = [
  {
    name: 'Abdul F.',
    initials: 'AF',
    rating: 5,
    date: 'a week ago',
    content: "I've taken several web development courses, but this one on Udemy stands out as the best by far. The instructor \"Hitesh sir\" breaks down complex concepts and explains everything like a piece of cake, making it easy to follow alon...",
    showMore: true,
  },
  {
    name: 'Arshyan A.',
    initials: 'AA',
    rating: 5,
    date: 'a week ago',
    content: "This course is awesome for web development Not for JavaScript mastery In this course only that much teach the javascript what we needed This course is for master the web development awesome 👍",
    showMore: false,
  },
];

export default function Testimonial(){
  return(
    <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />
              <span className="text-xl font-bold ml-2">4.8 course rating • 2K ratings</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                      {testimonial.initials}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{testimonial.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating ? 'fill-yellow-400 stroke-yellow-400' : 'fill-gray-300 stroke-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-gray-500 text-sm ml-2">{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.content}</p>
                  {testimonial.showMore && (
                    <button className="text-gray-500 hover:text-gray-700 mt-2">Show more</button>
                  )}
                </div>
              ))}
            </div>
          </div>
  )
}