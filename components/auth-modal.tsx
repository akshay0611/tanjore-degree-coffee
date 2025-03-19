"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase/client"
import { AuthError } from "@supabase/supabase-js"

export function AuthModal() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createProfile = async (userId: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .insert([
          { id: userId, email: userEmail }
        ])
      
      if (error) throw error;
      console.log("Profile created successfully");
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  }

  const handleAuth = async () => {
    setError(null)

    // Validate confirm password for sign-up
    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      if (isSignIn) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/auth") // Redirect to the auth page after sign-in
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              email: email,
            }
          }
        })
        
        if (error) throw error
        
        // Create profile for the new user
        if (data.user) {
          await createProfile(data.user.id, email)
        }
        
        alert("Check your email for the confirmation link!")
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="transition-all duration-300 
            bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 
            text-amber-50 shadow-md hover:shadow-lg hover:scale-105"
        >
          Order Online
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
            {isSignIn ? "Welcome Back!" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          {!isSignIn && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm col-span-4 text-center">{error}</p>}
        </div>
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-50 transition-colors duration-200"
          >
            {isSignIn ? "Need an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
          <Button
            onClick={handleAuth}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 
              text-amber-50 shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}