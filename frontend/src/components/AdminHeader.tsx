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
      <HatIcon className="w-8 h-8" />
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

function HatIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
  );
}