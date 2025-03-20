"use client"

import { Coffee, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileHeaderProps {
  toggleMobileMenu: () => void
}

export default function MobileHeader({ toggleMobileMenu }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-amber-900 text-amber-50 md:hidden">
      <div className="flex items-center gap-2">
        <Coffee className="h-6 w-6" />
        <span className="font-bold">Tanjore Coffee</span>
      </div>
      <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-amber-50">
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  )
}