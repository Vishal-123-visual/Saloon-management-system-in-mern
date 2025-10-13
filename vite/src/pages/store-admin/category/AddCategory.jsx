import { useNavigate } from "react-router-dom";
import { useCategory } from "../../store-client/components/sheets/CartContext";
import { CategoryForm } from "./CategoryForm";

const AddCategory = () => {
  const navigate = useNavigate();
  const { createCategory } = useCategory();

  const handleSubmit = async (values) => {
    const res = await createCategory(values.name, values.image);
    if (res?.success) {
      setTimeout(() => navigate("/store-admin/inventory/all-categories"), 1000);
    }
    return res;
  };


  return (
    <div className="h-full w-screen lg:w-[calc(100vw-285px)] xl:w-[calc(100vw-730px)] overflow-hidden flex justify-center items-center mx-auto px-2 bg-gray-50">
     <div className="h-full flex justify-center items-center px-2 bg-gray-50">
      <div className="w-full sm:w-md bg-white rounded-xl shadow-md p-6">
        <CategoryForm mode="create" onSubmitForm={handleSubmit} />
      </div>
    </div>
    </div>
  );
};

export default AddCategory;

