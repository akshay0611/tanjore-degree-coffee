"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function OrdersView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">Orders</h1>
      <Card className="bg-white border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((order) => (
              <Card key={order} className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-900 text-base">Order #{1000 + order}</CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order === 1 ? "bg-amber-200 text-amber-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order === 1 ? "Processing" : "Delivered"}
                    </span>
                  </div>
                  <CardDescription>
                    {order} day{order > 1 ? "s" : ""} ago
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Tanjore Filter Coffee x {order}</span>
                      <span className="font-medium text-amber-900">₹{80 * order}</span>
                    </div>
                    {order > 1 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-700">Butter Biscuits x 1</span>
                        <span className="font-medium text-amber-900">₹40</span>
                      </div>
                    )}
                    <Separator className="my-2 bg-amber-200" />
                    <div className="flex justify-between">
                      <span className="font-medium text-amber-900">Total</span>
                      <span className="font-bold text-amber-900">₹{80 * order + (order > 1 ? 40 : 0)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="text-amber-700 border-amber-300 text-xs">
                      View Details
                    </Button>
                    <Button variant="outline" className="text-amber-700 border-amber-300 text-xs">
                      Reorder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}