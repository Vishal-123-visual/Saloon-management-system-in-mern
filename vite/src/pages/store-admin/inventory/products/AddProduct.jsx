import { useNavigate } from "react-router-dom";
import { ProductForm } from "./ProductForm";
import { useProduct } from "../../../store-client/components/sheets/CartContext";


const AddProduct = () => {
  const { createProduct } = useProduct();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const res = await createProduct(data);
    if (res?.success) {
      navigate("/store-admin/inventory/all-products"); // redirect to list page
    }
    return res;
  };

  return (
    <div className="h-full w-screen lg:w-[calc(100vw-285px)] xl:w-[calc(100vw-730px)] overflow-hidden flex justify-center items-center mx-auto px-2 bg-gray-50">
    <div className=" w-full sm:w-xl mx-auto rounded-xl shadow-md  p-6">
      <ProductForm mode="create" onSubmitForm={handleSubmit} />
    </div>

    </div>
  );
};

export default AddProduct;
