import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useUser } from '@/hooks/useUser';  // Adjust the import path as necessary

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(event.target.value);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      console.log('Signed out successfully');
      navigate('/'); // Redirect to home page or login page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if the current path is Playground or Booking, and hide search bar accordingly
  const hideSearchBar = location.pathname.includes('/course') || location.pathname.includes('/detail') || location.pathname.includes('/profile') || location.pathname.includes('/admin');

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-background border-b md:px-6">
      <Link to="/home" className="flex items-center gap-2" >
        <BookIcon className="w-6 h-6" />
        <span className="sr-only">Strentor</span>
      </Link>

      {/* Conditionally render the search bar */}
      {!hideSearchBar && (
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search courses..."
            className="w-full pl-8 rounded-lg"
            onChange={handleSearchInput}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="text-muted-foreground hover:text-foreground hover:underline hover:text-purple-500"
        >
          My Courses
        </Link>
      
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8 bg-primary text-primary-foreground bg-purple-500 flex items-center justify-center">
                  {user.email ? user.email[0].toUpperCase() : ''}
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem><Link to="/profile">My Account</Link></DropdownMenuItem>
            
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!user && (
          <Link to="/" className="text-muted-foreground hover:text-foreground hover:underline hover:text-green-500">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

function BookIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
