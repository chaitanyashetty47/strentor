
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {useNavigate} from "react-router-dom"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { createClient, SupabaseClient  } from "@supabase/supabase-js";

enum Role{
  ADMIN,
  TUTOR,
  USER
}

type SignupData = {
  email: string;
  password:string;
  name?:string;
  role?: Role
}

type SigninData = {
  email: string;
  password:string;
  role: Role
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Auth(){
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SignupData>()
  const navigate = useNavigate()

  const onSubmit = async (data: SignupData) => {
    try {
      let authData
      let error

      if (isSignUp) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp(data)
        authData = signUpData
        error = signUpError
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(data)
        authData = signInData
        error = signInError
      }

      if (error) throw error

      console.log(isSignUp ? 'Sign up successful' : 'Sign in successful')

      if (authData && authData.user) {
        // Create or update user in your PostgreSQL database
        // await axios.post(`${BACKEND_URL}/users`, {
        //   supabaseId: authData.user.id,
        //   email: authData.user.email
        // })

        navigate('/home')
      }
    } catch (error) {
      console.error(`Error during ${isSignUp ? 'sign up' : 'sign in'} process:`, error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Card className=" w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>
            {isSignUp? `Sign Up`: `Sign In`} 
          </CardTitle>
          <CardDescription>Apply for our academy and join</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {
          isSignUp && <div>
              <Input 
                type="name" 
                placeholder="Name" 
                {...register("name", { 
                  required: "Name is required",
                  
                })}
                className={`w-full border-gray-300 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div> }
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
            {isSignUp && <div>
              <Select {...register("role")}>
                  <SelectTrigger id="roles">
                    <SelectValue placeholder="Choose Role" className=""/>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="user">USER</SelectItem>
                    <SelectItem value="tutor">TUTOR</SelectItem>
                    <SelectItem value="admin">ADMIN</SelectItem>
                  </SelectContent>
              </Select>
            </div>}
            {!isSignUp && (
              <div className="text-right">
                <a 
                  href="#" 
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Forgot password?
                </a>
              </div>
            )}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              {isSignUp ? 'SIGN UP' : 'LOG IN'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setIsSignUp(!isSignUp)
              }}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </a>
          </div>
        </CardContent>

      </Card>
      
    </div>
  )
  
  
}
