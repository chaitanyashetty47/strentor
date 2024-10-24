import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useUser } from '@/hooks/useUser';

export default function AdminHeader() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      console.log('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-background border-b md:px-6">
      <Link to="/home" className="flex items-center gap-2" >
        <BookIcon className="w-6 h-6" />
        <span className="sr-only">Strentor</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/admin/home"
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