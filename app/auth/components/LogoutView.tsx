"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LogoutViewProps {
  setActiveItem: (item: string) => void
}

export default function LogoutView({ setActiveItem }: LogoutViewProps) {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card className="w-full max-w-md bg-white border-amber-200">
        <CardHeader className="text-center">
          <CardTitle className="text-amber-900">Confirm Logout</CardTitle>
          <CardDescription>Are you sure you want to log out of your account?</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 justify-center">
          <Button
            variant="outline"
            className="text-amber-700 border-amber-300"
            onClick={() => setActiveItem("Dashboard")}
          >
            Cancel
          </Button>
          <Button className="bg-amber-700 hover:bg-amber-800 text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}