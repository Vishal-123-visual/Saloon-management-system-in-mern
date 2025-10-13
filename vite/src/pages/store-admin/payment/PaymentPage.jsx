import { useEffect, useState } from 'react';
import { CircleX } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '../../../config/endpoin.config';
import {
  useCart,
  useCustomer,
  useSaveCart,
} from '../../store-client/components/sheets/CartContext';
import { apiFetch } from '../../store-client/components/utils/ApiFetch';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const savedCartId = queryParams.get('savedCartId');

  const { getSavedCartById, deleteSavedCart } = useSaveCart();
  const { clearCart } = useCart();
  const { customer, setCustomer } = useCustomer();
  const { theme } = useTheme();
  //console.log(customer)

  // State
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('₹');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [loading, setLoading] = useState(false);

  // Load cart items if navigated from CartPage
  useEffect(() => {
    if (location.state?.items) {
      setItems(location.state.items);
    }
  }, [location.state]);

  // Load saved cart if navigated from SavedCartPage
  useEffect(() => {
    if (savedCartId) {
      async function fetchSavedCart() {
        setLoading(true);
        const cart = await getSavedCartById(savedCartId);
        if (cart) {
          //console.log(cart)
          setItems(cart.items || []);
          setCustomer(cart.customer);
        }
        setLoading(false);
      }
      fetchSavedCart();
    }
  }, [savedCartId]);

  // Calculations
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount =
    discountType === '%' ? (total * discount) / 100 : discount;
  const finalAmount = discountAmount
    ? Math.max(total - discountAmount, 0)
    : total;

  // Save Payment API
  const handleSavePayment = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/payment`, {
        method: 'POST',
        body: JSON.stringify({
          customer,
          items,
          total,
          discount,
          discountType,
          finalAmount,
          paymentMode,
        }),
      });

      if (res.success) {
        toast.success('Payment saved!');

        // Delete saved cart or clear cart
        if (savedCartId) {
          await deleteSavedCart(savedCartId);
        } else {
          await clearCart();
        }
        setCustomer(null);

        //console.log(res)
        // Redirect to Invoice page
        navigate(`/store-admin/invoice/${res.data._id}`);
      } else {
        toast.error(res.message || 'Failed to save payment');
      }
    } catch (err) {
      toast.error(err.message);
      //console.error("Error saving payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full relative lg:w-[calc(100vw-285px)] xl:w-[calc(100vw-730px)]  flex justify-center items-center mx-auto px-2 bg-gray-50 ">
      <div
        className={`p-6 w-full mx-auto ${theme === 'dark' ? 'text-black' : ''}`}
      >
        <h1 className="text-2xl font-bold mb-6">Payment</h1>
        <div
          onClick={() => navigate('/')}
          className=" absolute top-2 right-2 cursor-pointer"
        >
          <CircleX />
        </div>
        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && (
          <>
            {/* Customer Info */}
            <Card className="mb-6">
              <CardContent className="p-4 space-y-3 flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Customer Name"
                  value={customer?.name}
                  onChange={(e) =>
                    setCustomer((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="font-medium"
                />
                <Input
                  placeholder="Customer Phone"
                  value={customer?.phone}
                  onChange={(e) =>
                    setCustomer((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="font-medium"
                />
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="mb-6">
              <CardContent className="p-4 space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between font-medium border-b pb-2 last:border-0"
                  >
                    <span className=" ">
                      {item.serviceId?.serviceName ||
                        item.name ||
                        'Unnamed Service'}
                    </span>
                    <span>
                      {item.quantity} × ₹{item.price} = ₹
                      {(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between font-medium border-b pb-2">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                {/* Discount Section (Calculator Style) */}
                <div className={`${theme === 'dark' ? 'text-black' : ''}`}>
                  <div className="mb-2 font-semibold">Discount</div>
                  <div className="flex gap-2 mb-3 font-medium border-b pb-1">
                    <button
                      className={`px-3 py-1 rounded border ${discountType === '₹' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                      onClick={() => setDiscountType('₹')}
                    >
                      ₹
                    </button>
                    <button
                      className={`px-3 py-1 rounded border ${discountType === '%' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                      onClick={() => setDiscountType('%')}
                    >
                      %
                    </button>
                  </div>

                  <div className=" flex flex-col sm:flex-row justify-center items-center sm:items-start  gap-3 ">
                    {/* Calculator keypad */}
                    <div className=" grid grid-cols-3 place-items-center gap-2 sm:h-72  w-full sm:w-1/2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                        <div key={num}>
                          <button
                            className=" border bg-teal-700 text-white shadow-md  shadow-neutral-600 hover:bg-teal-900 px-5 py-3 rounded-full font-medium "
                            onClick={() =>
                              setDiscount(Number(`${discount}${num}`))
                            }
                          >
                            {num}
                          </button>
                        </div>
                      ))}
                      <button
                        className=" w-full p-3 font-medium rounded border bg-red-200 hover:bg-red-300  col-span-3"
                        onClick={() => setDiscount(0)}
                      >
                        Clear
                      </button>
                    </div>

                    <div className=" sm:h-72 w-full sm:w-1/2 bg-neutral-50 flex flex-col justify-between gap-5 sm:gap-0 rounded-md shadow-md  p-2">
                      <div>
                        <div className="flex justify-between font-medium  pb-2">
                          <span>Total Amount:</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <span className="font-semibold">
                             Discount:
                          </span>{' '}
                          <span className=" font-medium">
                            {discount}
                            {discountType}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <span className="font-semibold">
                            {' '}
                            Discount Amount:
                          </span>{' '}
                          <span className=" font-medium">
                            ₹{discountAmount}
                          </span>
                        </div>
                      </div>
                      {/* Final Amount */}
                      <div className="flex justify-between font-bold mt-3">
                        <span>Final Amount:</span>
                        <span>₹{finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Mode */}
            <div className="mb-6">
              <div className="mb-2 font-semibold">Payment Mode:</div>
              <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-3">
                  {['cash', 'card', 'online'].map((mode) => (
                    <button
                      key={mode}
                      className={`px-4 py-2 rounded border capitalize ${
                        paymentMode === mode
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100'
                      }`}
                      onClick={() => setPaymentMode(mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                {/* Actions */}
                <div className="flex gap-4">
                  <Button onClick={handleSavePayment} disabled={loading}>
                    Pay & Print Invoice
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
