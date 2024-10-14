

const VideoSection = () => {
  return (
    <div className="bg-black">
      <div className="max-w-6xl mx-auto aspect-video relative">
        <img src="/api/placeholder/1280/720" alt="Course thumbnail" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white rounded-full p-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-75 text-white p-2 rounded">
          <p className="font-bold">Jose Salvatierra</p>
          <p className="text-sm">Founder of Teclado</p>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;