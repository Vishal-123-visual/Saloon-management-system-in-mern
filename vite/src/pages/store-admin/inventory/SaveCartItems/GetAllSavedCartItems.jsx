import { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link, useNavigate } from 'react-router-dom'; // ✅ import navigate
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSaveCart } from '../../../store-client/components/sheets/CartContext';

export default function SavedCartsPage() {
  const { savedCarts, getAllSavedCarts, deleteSavedCart, deleteAllSavedCarts } =
    useSaveCart();
  const [search, setSearch] = useState('');
  const [filteredCarts, setFilteredCarts] = useState([]);
  const navigate = useNavigate(); // ✅ router hook
  const { theme } = useTheme();

  useEffect(() => {
    getAllSavedCarts(); // load carts on mount
  }, []);

  //console.log('save',savedCarts)
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCarts(savedCarts);
    } else {
      const s = search.toLowerCase();
      setFilteredCarts(
        savedCarts.filter(
          (cart) =>
            cart.customer.name?.toLowerCase().includes(s) ||
            cart.customer.phone?.toLowerCase().includes(s),
        ),
      );
    }
  }, [search, savedCarts]);

  const handlePayment = (cartId) => {
    // ✅ redirect to PaymentPage with savedCartId
    navigate(`/store-admin/payment?savedCartId=${cartId}`);
  };

  const handleViewCart = async(cart) => {
    //console.log(cart)
  navigate('/store-client/cart-page', { state: { cartData: cart } });
   await deleteSavedCart(cart?._id)
};

  return (
    <div className="w-screen lg:w-[calc(100vw-285px)] xl:w-[calc(100vw-730px)] overflow-hidden flex justify-center items-center mx-auto px-2 bg-gray-50">
      <div className="w-full p-6">
        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${theme === 'dark' ? 'text-white placeholder:text-white' : ''}`}
          />
        </div>

        {/* Saved Carts */}
        {filteredCarts.length === 0 ? (
          <p className="text-gray-500">
            No saved carts found.{' '}
            <Link to={'/'} className=" text-blue-500">
              Click here to save cart items
            </Link>
          </p>
        ) : (
          <div className="grid gap-4">
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => deleteAllSavedCarts()}
              >
                Delete All
              </Button>
            </div>
            {filteredCarts.map((cart) => (
              <Card key={cart._id} className="rounded-2xl shadow-sm">
                <CardContent className="p-4 space-y-3">
                  {/* Customer Info */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold">
                        {cart.customer.name} ({cart.customer.phone})
                      </h2>
                      <p className="text-sm text-gray-500">
                        Saved on {new Date(cart.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-400 text-red-700"
                      onClick={() => deleteSavedCart(cart?._id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                  {/* Items */}
                  <div className="space-y-2">
                    {cart.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 flex items-center justify-center rounded-full overflow-hidden">
                            <img
                              src={item.serviceId?.imageUrl || ''}
                              alt={
                                item.serviceId?.serviceName || 'Unknown Service'
                              }
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="font-medium">
                              {item.serviceId?.serviceName || 'Unknown Service'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Total + Payment */}
                  {/* // Add inside the Total + Payment div */}
                  <div className="flex justify-between items-center pt-2 gap-2">
                    <span className="font-bold">
                      Total: ₹
                      {cart.items
                        .reduce((sum, i) => sum + i.price * i.quantity, 0)
                        .toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Button onClick={() => handlePayment(cart._id)}>
                        Proceed to Payment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleViewCart(cart)}
                      >
                        View Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
