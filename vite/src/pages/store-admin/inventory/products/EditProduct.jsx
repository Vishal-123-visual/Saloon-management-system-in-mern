import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../../store-client/components/sheets/CartContext";
import { ProductForm } from "./ProductForm";


const EditProduct = () => {
  const { id } = useParams(); // productId from route
  const { products, fetchProducts, updateProduct } = useProduct();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const found = products.find((p) => p._id === id);
    if (found) setProduct(found);
  }, [products, id]);

  const handleSubmit = async (data) => {
    const res = await updateProduct(id, data);
    if (res?.success) {
      navigate("/store-admin/inventory/all-products");
    }
    return res;
  };

  if (!product) {
    return <p className="text-center py-10">Loading product...</p>;
  }

  return (
    <div className="h-full w-screen lg:w-[calc(100vw-285px)] xl:w-[calc(100vw-730px)] overflow-hidden flex justify-center items-center mx-auto px-2 bg-gray-50">
    <div className=" w-full sm:w-xl mx-auto rounded-xl shadow-md  p-6">
      <ProductForm
        mode="edit"
        initialData={product}
        onSubmitForm={handleSubmit}
      />
    </div>

    </div>
  );
};

export default EditProduct;
