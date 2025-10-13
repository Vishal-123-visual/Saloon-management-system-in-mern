import { useParams, useNavigate } from "react-router-dom";
import { useCategory } from "../../store-client/components/sheets/CartContext";
import { CategoryForm } from "./CategoryForm";
import { toast } from "sonner";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, updateCategory } = useCategory();

  const category = categories.find((c) => c._id === id);

  const handleSubmit = async (values) => {
    const res = await updateCategory(id, {
      name: values.name,
      image: values.image,
    });
    //console.log(res)
    if (res?.success) {
      setTimeout(() => navigate("/store-admin/inventory/all-categories"), 1000);
    }
    return res;
  };

  if (!category) return <p>Loading...</p>;

  return (
    <div className="h-full w-screen lg:w-[calc(100vw-285px)] xl:w-[calc(100vw-730px)] overflow-hidden flex justify-center items-center mx-auto px-2 bg-gray-50">
      <div className="w-full sm:w-md bg-white rounded-xl shadow-md p-6">
        <CategoryForm
          mode="edit"
          initialData={{ name: category.name, image: category.image }}
          onSubmitForm={handleSubmit}
        />
      </div>
    </div>
  );
};

export default EditCategory;
