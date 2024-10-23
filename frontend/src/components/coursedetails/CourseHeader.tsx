import { useNavigate } from 'react-router-dom';

const Header = ({ title}:{title:string} ) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will go back to the previous route
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center">
      <button 
          onClick={handleGoBack}
          className="mr-4 hover:bg-gray-700 p-1 rounded-full transition-colors"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  );
};

export default Header;