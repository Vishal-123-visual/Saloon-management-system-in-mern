import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card2 } from '../../components/common/card2';
import { useProduct, useSeacrh } from '../../components/sheets/CartContext';

export function Deals() {
  const { products } = useProduct();
     const { searchQuery } = useSeacrh(); // ✅ from context

  // filter products with active true
 //const filterProduct =  products.filter((item) => item.active === true);
 //console.log(filterProduct)

 const query  = searchQuery.toLowerCase();
 const filteredProducts = products.filter((item) => (item.serviceName || "").toLowerCase().includes(query) || (item.label || "").toLowerCase().includes(query) )


  return (
    <div className="space-y-4 p-5">
      <div className="grid sm:grid-cols-2  2xl:grid-cols-4  gap-5 mb-2 ">
        {filteredProducts.map((item, index) => {
          return (
            <Card2
              key={item._id + index}
              image={item.imageUrl}
              star={5}
              title={item.serviceName}
              total={item.price}
              discount={item.discountPrice}
              label={item.label}
              badge={23}
              id={item._id}
            />
          );
          // return renderItem(item, index);
        })}
      </div>
    </div>
  );
}
