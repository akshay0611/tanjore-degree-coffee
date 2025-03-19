"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function AuthModal() {
  const [isSignIn, setIsSignIn] = useState(true)

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
                className="col-span-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          )}
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
            type="submit"
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