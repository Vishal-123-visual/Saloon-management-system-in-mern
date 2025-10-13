import { useEffect, useState } from 'react';
import { HomeIcon, Printer } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '../../../config/endpoin.config';
import { apiFetch } from '../../store-client/components/utils/ApiFetch';
import { useTheme } from 'next-themes';

export default function InvoicePage() {
  const { id } = useParams(); // payment ID from URL
  const [payment, setPayment] = useState(null);
  const {theme} = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchPayment() {
      const res = await apiFetch(`${API_BASE_URL}/payment/${id}`);
      if (res.success) {
        setPayment(res.data);
      } else {
        toast.error(res.message);
      }
    }
    fetchPayment();
  }, [id]);

  if (!payment) return <p>Loading invoice...</p>;

  const handlePrint = () => {
    document.getElementById('btn').style.display = 'none';
    window.print();
    setTimeout(() => {
      document.getElementById('btn').style.display = 'flex';
    }, 10);
  };
  //console.log(payment)
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black ">
      <div
        className=" w-full  md:w-md p-4 mx-auto flex justify-between items-center  "
        id="btn"
      >
        <Button variant="outline" onClick={()=>navigate('/')} className={`${theme === 'dark' ? 'bg-white hover:bg-gray-100' : ''} cursor-pointer`}>
          <Link>
            {' '}
            <HomeIcon className="text-green-600" />
          </Link>
        </Button>
        <Button variant="outline" className={`${theme === 'dark' ? 'bg-white hover:bg-gray-100' : ''}`} onClick={handlePrint}>
          <Printer className="text-black " />
        </Button>
      </div>
      <div className="p-6 w-full md:w-md mx-auto border rounded-lg">
        <div className=" border-b border-neutral-500  pb-2">
          <h2 className="text-2xl font-bold mb-4 underline ">Reciept</h2>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>Customer:</strong> {payment?.customer?.name}
          </p>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>Phone:</strong> {payment?.customer?.phone}
          </p>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>Email:</strong> {payment?.customer?.email}
          </p>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>Country:</strong> {payment?.customer?.country}
          </p>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>State:</strong> {payment?.customer?.state}
          </p>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>City:</strong> {payment?.customer?.city}
          </p>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>Street:</strong> {payment?.customer?.street}
          </p>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>Pin/Code:</strong> {payment?.customer?.code}
          </p>
          <p className=" border border-b-0 border-neutral-400 px-1 ">
            <strong>Date&Time:</strong>{' '}
            {new Date(payment.createdAt).toLocaleString()}
          </p>
          <p className=" border border-neutral-400 px-1 ">
            <strong>Payment Mode:</strong> {payment.paymentMode}
          </p>
        </div>

        <table className="w-full  border-collapse  mt-3">
          <thead>
            <tr className="border-b border-neutral-600">
              <th className="border border-neutral-600 px-2 py-1 text-left">
                Item
              </th>
              <th className="border border-neutral-600 px-2 py-1">Qty</th>
              <th className="border border-neutral-600 px-2 py-1">Price</th>
              <th className="border border-neutral-600 px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {payment.items.map((item, idx) => (
              <tr key={idx} className="border-b border-neutral-600">
                <td className="border border-neutral-600 px-2 py-1">
                  {item.name || item.serviceId?.serviceName}
                </td>
                <td className="border border-neutral-600 px-2 py-1 text-center">
                  {item.quantity}
                </td>
                <td className="border border-neutral-600 px-2 py-1 text-right">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="border border-neutral-600 px-2 py-1 text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex justify-between">
          <span>Total:</span>
          <span>₹{payment.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>
            Discount ({payment.discount}
            {payment.discountType}):
          </span>
          <span>₹{(payment.total - payment.finalAmount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold mt-1">
          <span>Final Amount:</span>
          <span>₹{payment.finalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
