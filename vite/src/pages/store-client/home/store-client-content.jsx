import { useEffect, useState } from 'react';
import { ca } from 'zod/v4/locales';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCategory, useProduct } from '../components/sheets/CartContext';
import {
  Deals,
  FeaturedProducts,
  Info,
  NewArrivals,
  PopularSneakers,
  Search,
  SpecialOffers,
} from './components';
import { useTheme } from 'next-themes';

export function StoreClientContent() {
  const { categories,fetchCategories } = useCategory();
  const { fetchProducts, getProductByCategory, products } = useProduct();
  const [selectedCategory, setSelectedCategory] = useState(null);
      const { theme } = useTheme();

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (catId) {
      getProductByCategory(catId);
    } else {
      fetchProducts();
    }
  };
  useEffect(()=>{
    fetchCategories()
  },[])

  return (
    <div className=" w-full    ">
      <ScrollArea>
        <div className=" w-[300px]  sm:w-full flex justify-between items-center gap-2.5 px-3 mt-3 border-b pb-2">
          {categories &&
            categories.length > 0 &&
            categories.map((cat, index) => {
              return (
                <div
                  key={cat._id + index}
                  className={` flex flex-col items-center justify-center cursor-pointer`}
                  onClick={() => handleCategoryClick(cat._id)}
                >
                  <div className="flex items-center justify-center  rounded-md  bg-accent/50">
                    <img
                      src={cat?.image}
                      alt={cat?.name}
                      className="rounded-full size-10 shrink-0"
                    />
                  </div>
                  <p
                    className={` text-ellipsis line-clamp-1 text-[10px] font-medium  ${selectedCategory === cat._id ? 'text-red-500' : (theme === "dark"? 'text-white' : 'text-neutral-700' )}  `}
                  >
                    {' '}
                    {cat?.name}{' '}
                  </p>
                </div>
              );
            })}

          {/* "All Products" button */}
          <div
            className={`flex flex-col items-center justify-center cursor-pointer ${
              !selectedCategory ? 'border-2 border-cyan-500' : ''
            }`}
            onClick={() => handleCategoryClick(null)}
          >
            <div className="flex items-center justify-center rounded-md bg-accent/50 p-2">
              <p className="text-xs font-semibold text-ellipsis line-clamp-1">All Pr...</p>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Products */}
      {products.length > 0 ? (
        <Deals />
      ) : selectedCategory ? (
        <div className="h-full ">
          <p className="text-center mt-5 text-neutral-700 font-medium">
            This category has no products.
          </p>
        </div>
      ) : (
        <div className="h-full">
          <p className="text-center mt-5 text-neutral-700 font-medium">
            No products available.
          </p>
        </div>
      )}
    </div>
  );
}
