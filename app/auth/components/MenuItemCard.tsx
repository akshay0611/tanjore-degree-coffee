// app/auth/components/MenuItemCard.tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  vegan?: boolean;
  new?: boolean;
  chefSpecial?: boolean;
};

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onViewDetails: () => void;
  quantity?: number; // Add quantity prop
}

export default function MenuItemCard({ item, onAddToCart, onViewDetails, quantity = 0 }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden border-amber-200 transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between">
          {item.popular && (
            <Badge className="bg-amber-500 hover:bg-amber-600">
              <Star className="h-3 w-3 mr-1 fill-current" /> Popular
            </Badge>
          )}
          {item.new && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
          {item.chefSpecial && <Badge className="bg-purple-500 hover:bg-purple-600">Chef&apos;s Special</Badge>}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-900">{item.name}</CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {item.vegan && (
            <Badge variant="outline" className="border-green-500 text-green-600">
              Vegan
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-lg font-bold text-amber-900">₹{item.price}</span>
        <div className="flex gap-2 items-center">
          {quantity > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-900">
              +{quantity}
            </Badge>
          )}
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700" onClick={onViewDetails}>
            Details
          </Button>
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800 text-white" onClick={() => onAddToCart(item)}>
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}