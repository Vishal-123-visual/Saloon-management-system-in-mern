import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card2 } from '../../components/common/card2';
import { useEffect, useState } from 'react';

export function PopularSneakers() {
   const [items, setItems] = useState([]);
   const fetchAllServices = async () => {
     try {
       const res = await fetch(
         'http://localhost:5002/api/v1/salon/all-services',
         {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
         },
       );
       const resData = await res.json();
       //console.log('resdata', resData)
       setItems(resData);
     } catch (error) {
       console.log(items.message);
     }
   };
 
   useEffect(() => {
     fetchAllServices();
   }, []);
   console.log(items);

  const renderItem = (item, index) => (
    <Card2
      image={item.imageUrl}
      star={item.star}
      title={item.name}
      total={item.price}
      key={index}
    />
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-medium text-mono">Popular Sneakers</span>

        <Button mode="link" asChild>
          <Link to="/account/home/get-started" className="text-xs">
            See All <ChevronRight />
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-2">
        {items.map((item, index) => {
          return renderItem(item, index);
        })}
      </div>
    </div>
  );
}
