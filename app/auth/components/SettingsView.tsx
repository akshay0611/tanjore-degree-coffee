"use client"

import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">Settings</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-amber-700 block mb-1">Email Notifications</label>
              <div className="flex items-center gap-2 p-2 border border-amber-200 rounded-md bg-amber-50">
                <input type="checkbox" id="emailNotif" className="rounded text-amber-600" defaultChecked />
                <label htmlFor="emailNotif" className="text-amber-900">
                  Receive order updates
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-amber-700 block mb-1">SMS Notifications</label>
              <div className="flex items-center gap-2 p-2 border border-amber-200 rounded-md bg-amber-50">
                <input type="checkbox" id="smsNotif" className="rounded text-amber-600" defaultChecked />
                <label htmlFor="smsNotif" className="text-amber-900">
                  Receive delivery updates
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-amber-700 block mb-1">Language</label>
              <select className="w-full p-2 border border-amber-200 rounded-md bg-amber-50 text-amber-900">
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </div>
            <Button className="bg-amber-700 hover:bg-amber-800 text-white">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border border-amber-200 rounded-md bg-amber-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="font-medium text-amber-900">•••• •••• •••• 4242</p>
                  <p className="text-xs text-amber-700">Expires 12/25</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs">Default</span>
            </div>
            <div className="p-3 border border-amber-200 rounded-md bg-amber-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="font-medium text-amber-900">•••• •••• •••• 8888</p>
                  <p className="text-xs text-amber-700">Expires 08/24</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="text-amber-700 border-amber-300 w-full">
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Saved Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Home", "Work", "Parents"].map((label, index) => (
              <div
                key={label}
                className="p-3 border border-amber-200 rounded-md bg-amber-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-amber-900">{label}</p>
                  <p className="text-sm text-amber-700">
                    {index === 0 && "123 Coffee Street, Tanjore, Tamil Nadu"}
                    {index === 1 && "456 Tech Park, Chennai, Tamil Nadu"}
                    {index === 2 && "789 Temple Road, Kumbakonam, Tamil Nadu"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-amber-700">
                  Edit
                </Button>
              </div>
            ))}
            <Button variant="outline" className="text-amber-700 border-amber-300 w-full">
              Add New Address
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}