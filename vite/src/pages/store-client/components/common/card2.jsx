import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '../sheets/CartContext';
 // ✅ import your cart context hook

export function Card2({ id, badge, image, title, total, star, label,discount }) {
  const { addToCart } = useCart(); // ✅ get addToCart from context
  const finalPrice = discount ? total - discount : total

  const handleAddToCart = () => {
    addToCart({
      _id: id,
      name: title,
      price: Number(finalPrice),
      imageUrl: image,
      quantity: 1,
      label,
      badge,
      star,
    });
    // showCartSheet(); // ✅ open cart after adding
  };

  return (
    <div onClick={handleAddToCart} className="border rounded-lg">
      <div className="flex flex-col justify-between p-2.5 gap-4">
        {/* Product Image */}
        <div className="mb-2.5">
          <div className="flex items-center justify-center relative bg-accent/50 w-full 2xl:w-[245px] overflow-hidden h-[180px] rounded-md mb-4 shadow-none">
            {/* {badge && (
              <Badge
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 uppercase shrink-0"
              >
                save 40%
              </Badge>
            )} */}

            <img
              src={image}
              className="h-full w-full  cursor-pointer"
              alt={title}
            />
          </div>

          <div
            className="hover:text-primary text-sm font-medium text-mono px-2.5 leading-5.5 block cursor-pointer"
          >
            {title}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex items-center flex-wrap justify-between gap-5 px-2.5 pb-1">
          <Badge
            size="sm"
            variant="warning"
            shape="circle"
            className="rounded-full gap-1"
          >
            <Star
              className="text-white -mt-0.5"
              style={{ fill: 'currentColor' }}
            />{' '}
            {star}
          </Badge>

          <div className="flex items-center flex-wrap gap-1.5">
            {label && (
              <span className="text-xs font-normal text-secondary-foreground line-through pt-[1px]">
                {label}
              </span>
            )}
            <span className="text-sm font-medium text-mono">₹{finalPrice}</span>

            <Button
              size="sm"
              variant="outline"
              className="ms-1 text-green-800 border-green-500"
            
            >
              <ShoppingCart /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
