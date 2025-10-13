import { useEffect, useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useProduct } from './CartContext';
import { toast } from 'sonner';

export function Rating({ rating, outOf = 5 }) {
  const stars = [];
  for (let i = 1; i <= outOf; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-input'}`}
        fill={i <= rating ? 'currentColor' : 'none'}
      />,
    );
  }
  return <div className="flex items-center gap-1">{stars}</div>;
}

export function StoreClientProductDetailsSheet({
  open,
  onOpenChange,
  productId,
  addToCart,
}) {
  const { getProductById } = useProduct();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(productId); // ✅ use context method
        if (res.success) setProduct(res.data);
      } catch (err) {
       toast.error(err.message)
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!productId) return null;
  //console.log(product)

  const items = product
    ? [
        {
          text: 'Availability',
          info: product.active ? (
            <Badge size="sm" variant="success">
              In Stock
            </Badge>
          ) : (
            <Badge size="sm" variant="destructive">
              Out of Stock
            </Badge>
          ),
        },
        {
          text: 'SKU',
          info: (
            <span className="text-xs font-medium text-foreground">
              {product.sku || 'N/A'}
            </span>
          ),
        },
        {
          text: 'Category',
          info: (
            <span className="text-xs font-medium text-foreground">
              {product.category?.name}
            </span>
          ),
        },
        { text: 'Rating', info: <Rating rating={product.rating || 5} /> },
        {
          text: 'More Info',
          info: (
            <span className="text-xs font-normal text-foreground">
              {product.description}
            </span>
          ),
        },
      ]
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[520px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Product Details</SheetTitle>
        </SheetHeader>
        <SheetBody className="px-5 py-0">
          <ScrollArea className="h-[calc(100dvh-11.75rem)] pe-3 -me-3">
            {loading && <p>Loading product details...</p>}
            {product && (
              <CardContent className="flex flex-col space-y-3 p-5">
                <Card className="relative items-center justify-center bg-accent/50 mb-6.5 h-[280px] overflow-hidden">
                  {product.discountPrice && (
                    <Badge
                      size="sm"
                      variant="destructive"
                      className="absolute top-4 right-4 uppercase"
                    >
                      save{' '}
                      {Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100,
                      )}
                      %
                    </Badge>
                  )}
                  <img
                    src={product.imageUrl}
                    className=""
                    alt={product.serviceName}
                  />
                </Card>

                <span className="text-base font-medium text-mono">
                  {product.serviceName}
                </span>
                <span className="text-sm font-normal text-foreground block mb-7">
                  {product.description}
                </span>

                <div className="flex flex-col gap-2.5 lg:mb-11">
                  {items.map((item, index) => (
                    <div className="flex items-center gap-2.5" key={index}>
                      <span className="text-xs font-normal text-foreground min-w-14 xl:min-w-24 shrink-0">
                        {item.text}
                      </span>
                      <div>{item.info}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2">
                  {product.discountPrice && (
                    <span className="text-base font-normal text-secondary-foreground line-through">
                      ${product.discountPrice}
                    </span>
                  )}
                  <span className="text-lg font-medium text-mono">
                    ${product.price-product.discountPrice  }
                  </span>
                </div>
              </CardContent>
            )}
          </ScrollArea>
        </SheetBody>
        <SheetFooter className="border-t py-3.5 px-5 border-border">
          <Button
            onClick={() => productId && addToCart({ productId })}
            disabled={!productId}
            className="grow"
          >
            <ShoppingCart />
            Add to Cart
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
