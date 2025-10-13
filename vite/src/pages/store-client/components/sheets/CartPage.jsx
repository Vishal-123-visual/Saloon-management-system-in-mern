import { useEffect } from 'react';
import {
  CircleXIcon,
  Save,
  ShoppingCart,
  Trash,
  TrashIcon,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart, useCustomer, useSaveCart } from './CartContext';

const CartPage = () => {
  const { cartItems, setCartItems, removeFromCart, clearCart, updateQuantity } =
    useCart();
  const { saveCart, getAllSavedCarts } = useSaveCart();
  const { customer, setCustomer } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ access state from SavedCartsPage

  // ✅ If a saved cart is passed via state, populate cartItems & customer
  useEffect(() => {
    if (location.state?.cartData) {
      const cart = location.state.cartData;
      setCartItems(
        cart.items.map((item) => ({
          _id: item._id,
          serviceId: item.serviceId,
          price: item.price,
          quantity: item.quantity,
        })),
      );
      setCustomer(cart.customer);
    }
  }, [location.state, setCartItems, setCustomer]);

  const calculateTotal = () =>
    cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);

  const handleSaveCart = async () => {
    if (!customer || !customer._id) {
      toast.error('Please select customer name & phone');
      return;
    }
    try {
      const res = await saveCart(customer._id, cartItems);
      if (res.success) {
        toast.success(res.message);
        setTimeout(async () => {
          await getAllSavedCarts();
          navigate('/store-admin/saved-carts');
        }, 1000);
        clearCart();
        setCustomer('');
      } else {
        toast.error(res.message || 'Failed to save cart');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCheckout = async () => {
    if(!customer){
       toast.error("Please select customer")
       return;
    }
    navigate('/store-admin/payment', {
      state: {
        items: cartItems,
        customer: customer,
      },
    });
    setTimeout(async() => {
      await clearCart()
      setCustomer(null)
    }, 500);
  };

  return (
    <div className="py-4 lg:p-0">
      <div className="w-full sm:w-[600px] lg:w-[430px] border lg:border-none rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b py-3.5 px-5 border-border">
          <h1 className="text-lg font-semibold">Cart</h1>
          <Link to={'/'} className="block lg:hidden">
            <CircleXIcon />
          </Link>
        </div>

        {/* Cart Items */}
        <div className="px-5">
          <ScrollArea className="h-[calc(100dvh-260px)] pe-3 -me-3 space-y-5">
            {cartItems.length <= 0 ? (
              <p className="text-center py-10 text-muted-foreground">
                Your Cart Is Empty ?{' '}
                <Link to={'/'} className="text-blue-500 block xl:hidden">
                  Click here to add cart!
                </Link>
              </p>
            ) : (
              cartItems.map((item, index) => (
                <div className="mb-5" key={item._id || index}>
                  <div className="p-2 flex items-center justify-between gap-3.5">
                    {/* Product Info */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center bg-accent/50 h-[70px] w-[90px]">
                        <img
                          src={item.serviceId.imageUrl}
                          className="h-full w-full"
                          alt={item.serviceId.serviceName}
                        />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <Link
                          to="#"
                          className="hover:text-primary text-sm font-medium"
                        >
                          {item.serviceId.serviceName}
                        </Link>
                        <span className="text-xs">
                          Qty:{' '}
                          <span className="font-semibold">{item.quantity}</span>
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-red-800 font-bold text-3xl"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <button
                          className="text-green-800 font-bold text-2xl"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="py-4">
              {/* Total */}
              <div className="flex justify-between bg-accent/50 py-2 px-3 rounded-md mb-3">
                <span className="font-medium">Total</span>
                <span className="font-semibold">₹{calculateTotal()}</span>
              </div>

              <footer className="flex justify-between px-5">
                <div className="space-x-3">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-700"
                    onClick={clearCart}
                  >
                    <Trash />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-700"
                    onClick={handleSaveCart}
                  >
                    <Save />
                  </Button>
                </div>
                <Button variant="primary" onClick={handleCheckout}>
                  <ShoppingCart /> Checkout
                </Button>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
