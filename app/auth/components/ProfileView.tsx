"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">Profile</h1>
      <Card className="bg-white border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-amber-300">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-amber-700 text-amber-50 text-xl">JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" className="text-amber-700 border-amber-300">
                Change Photo
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-amber-700">Full Name</label>
                  <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">John Doe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-amber-700">Email</label>
                  <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">john@example.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-amber-700">Phone</label>
                  <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">+91 98765 43210</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-amber-700">Member Since</label>
                  <p className="mt-1 p-2 border border-amber-200 rounded-md bg-amber-50">January 2023</p>
                </div>
              </div>
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}