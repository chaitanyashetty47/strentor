import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

enum Role {
  ADMIN = "ADMIN",
  TUTOR = "TUTOR",
  USER = "USER"
}

type SignupData = {
  email: string;
  password: string;
  name?: string;
  role?: Role;
  bio?: string;
  aboutMe?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { control, register, handleSubmit, formState: { errors }, watch, reset } = useForm<SignupData>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

  const watchRole = watch("role")

  const onSubmit = async (data: SignupData) => {
    setIsLoading(true);
    try {
      let authData
      let error

      if (isSignUp) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })
        authData = signUpData
        error = signUpError
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        authData = signInData
        error = signInError
      }

      if (error) throw error

      if (authData && authData.user) {
        if (isSignUp) {
          const userData = {
            supabaseId: authData.user.id,
            email: data.email,
            role: data.role || 'USER',
            name: data.name || '',
            ...(data.role === Role.TUTOR && {
              bio: data.bio,
              aboutMe: data.aboutMe
            })
          };

          if (data.role === Role.TUTOR) {
            if (!data.bio) throw new Error('Bio is required for tutors');
            if (!data.aboutMe) throw new Error('About Me is required for tutors');
          }

          const response = await axios.post(`${BACKEND_URL}/users`, userData);
          console.log('Server response:', response.data);
        }

        toast({
          title: isSignUp ? "Sign up successful" : "Sign in successful",
          description: "Redirecting to home page...",
          duration: 2000,
        })

        navigate('/home')
      }
    } catch (error: any) {
      console.error(`Error during ${isSignUp ? 'sign up' : 'sign in'} process:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}. Please try again.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp)
    reset()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <span className="font-semibold font-mono text-4xl p-2">Courshala</span>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>
            {isSignUp ? `Sign Up` : `Sign In`} 
          </CardTitle>
          <CardDescription>Apply for our academy and join</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <div>
                <Input 
                  type="text" 
                  placeholder="Name" 
                  {...register("name", { required: "Name is required" })}
                  className={`w-full border-gray-300 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
            )}
            <div>
              <Input 
                type="email" 
                placeholder="Email Address" 
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address"
                  }
                })}
                className={`w-full border-gray-300 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                className={`w-full border-gray-300 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            {isSignUp && (
              <div>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="roles">
                        <SelectValue placeholder="Choose Role" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value={Role.USER}>USER</SelectItem>
                        <SelectItem value={Role.TUTOR}>TUTOR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
              </div>
            )}
            {isSignUp && watchRole === Role.TUTOR && (
              <>
                <div>
                  <Textarea
                    placeholder="Bio"
                    {...register("bio", { 
                      required: "Bio is required for tutors",
                      maxLength: {
                        value: 120,
                        message: "Bio must not exceed 120 characters"
                      } 
                    })}
                    className={`w-full border-gray-300 ${errors.bio ? 'border-red-500' : ''}`}
                  />
                  {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
                </div>
                <div>
                  <Textarea
                    placeholder="About Me"
                    {...register("aboutMe", { required: "About Me is required for tutors" })}
                    className={`w-full border-gray-300 ${errors.aboutMe ? 'border-red-500' : ''}`}
                  />
                  {errors.aboutMe && <p className="mt-1 text-xs text-red-500">{errors.aboutMe.message}</p>}
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
          </form>
          <div className="flex justify-center pt-3">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : 'New to the platform?'}
              <button onClick={toggleSignUp} className="pl-2 text-sm text-purple-600">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}