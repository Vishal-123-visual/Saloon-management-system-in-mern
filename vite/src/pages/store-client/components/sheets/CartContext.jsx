import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../config/endpoin.config";
import { apiFetch } from "../utils/ApiFetch";
import { toast } from "sonner";
import { fi } from "zod/v4/locales";
import { Flashlight } from "lucide-react";

// ---------------- CART CONTEXT ----------------
const cartContext = createContext();

// ---------------- CATEGORY CONTEXT ----------------
const categoryContext = createContext();

// ---------------- PRODUCT CONTEXT ----------------
const productContext = createContext();

// ---------------- SEARCH CONTEXT  ----------------
const SearchContext = createContext();

// ---------------- SAVE CART CONTEXT ----------------
const SaveCartContext = createContext();

// ---------------- CUSTOMER SEARCH ----------------
const CustomerContext = createContext();


// ---------------- PROVIDER ----------------
export const CartContextProvider = ({ children }) => {
  // ---------- Cart State ----------
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------- Category State ----------
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // ---------- Product/Service State ----------
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  // ---------- Search State ----------
  const [searchQuery, setSearchQuery] = useState("");

  // ---------- customer State ----------
  const [customer, setCustomer] = useState(null);
  const [showCustomer, setShowCustomer] = useState(false);

  // ---------- Save Cart State ----------
  const [savedCarts, setSavedCarts] = useState([]);
  const [saveCartLoading, setSaveCartLoading] = useState(false);

  // ---------------- CART METHODS ----------------
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const resData = await apiFetch(`${API_BASE_URL}/cart`);
      setCartItems(resData.data || []);
    } catch (error) {
      toast.error(error.message || 'error fetching cart items')
      //console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (serviceId, quantity = 1) => {
    try {
      const resData = await apiFetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        body: JSON.stringify({ serviceId, quantity }),
      });
      if (resData.success) {
        setCartItems((prev) => [
          ...prev,
          {
            ...resData.data,
            serviceId: resData.data.serviceId || { imageUrl: "", name: "" },
          },
        ]);
        toast.success(resData.message);
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      toast.error(error.message || 'you are not loged In');
      //console.error("Error adding item to cart:", error.message);
    }
  };

  const updateQuantity = async (_id, quantity) => {
    try {
      const resData = await apiFetch(`${API_BASE_URL}/cart`, {
        method: "PUT",
        body: JSON.stringify({ _id, quantity }),
      });

      setCartItems((prev = []) =>
        (prev || [])
          .filter((item) => !!item)
          .map((item) =>
            item._id === _id
              ? {
                  ...item,
                  quantity: resData?.data?.quantity ?? item.quantity ?? 0,
                  price: resData?.data?.price ?? item.price ?? 0,
                  serviceId: item.serviceId || {},
                }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
      fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error.message);
    }
  };

  const removeFromCart = async (_id) => {
    try {
      await apiFetch(`${API_BASE_URL}/cart`, {
        method: "DELETE",
        body: JSON.stringify({ _id }),
      });
      setCartItems((prev) => prev.filter((item) => item._id !== _id));
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };


  const clearCart = async () => {
    try {
      await apiFetch(`${API_BASE_URL}/cart/many`, {
        method: "DELETE",
    
      });
      setCartItems([]);
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };


   // ---------------- SAVE CART METHODS ----------------
  const saveCart = async (customer , items) => {
    try {
      setSaveCartLoading(true);
      const resData = await apiFetch(`${API_BASE_URL}/save-cart`, {
        method: "POST",
        body: JSON.stringify({ customer, items }),
      });

      if (resData.success) {
        toast.success(resData.message);
        return resData;
      } else {
        toast.error(resData.message );
        return { success: false, message: resData.message };
      }
    } catch (error) {
      const msg = error?.message || String(error) || 'Unknown error';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setSaveCartLoading(false);
    }
  };

  const getAllSavedCarts = async () => {
    try {
      setSaveCartLoading(true);
      const resData = await apiFetch(`${API_BASE_URL}/save-cart`,{
      });
      if (resData.success) {
        setSavedCarts(resData.data || []);
      } else {
        toast.error(resData.message || "Failed to fetch saved carts");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaveCartLoading(false);
    }
  };

  const getSavedCartById = async(id)=>{
    try {
      setSaveCartLoading(true)
      const response = await apiFetch(`${API_BASE_URL}/save-cart/${id}`,{
      })
      if(response.success){
       return response.data
      }
      else{
        toast.error(response.message)
        return null
      }
      
    } catch (error) {
      toast.error(error.message)
      return null
    }
    finally{setSaveCartLoading(false)}
  }

  const searchSavedCarts = async (query) => {
    try {
      setSaveCartLoading(true);
      const resData = await apiFetch(`${API_BASE_URL}/save-cart/search?query=${query}`);
      if (resData.success) {
        setSavedCarts(resData.data || []);
      } else {
        toast.error(resData.message || "Failed to search saved carts");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaveCartLoading(false);
    }
  };

  const deleteSavedCart = async (id)=>{
    try {
      const resData = await apiFetch(`${API_BASE_URL}/save-cart/${id}`, {
        method: "DELETE",
      });
      if (resData.success) {
        setSavedCarts((prev) => prev.filter((cart) => cart._id !== id));
        //toast.success("Saved cart deleted successfully");
      } else {
        toast.error(resData.message || "Failed to delete saved cart");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const deleteAllSavedCarts = async ()=>{
    try {
      const resData = await apiFetch(`${API_BASE_URL}/save-cart`, {
        method: "DELETE",
     
      });
      if (resData.success) {
        setSavedCarts([]);
        toast.success("All saved carts deleted successfully");
      } else {
        toast.error(resData.message || "Failed to delete all saved carts");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // ---------------- CATEGORY METHODS ----------------
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const resData = await apiFetch(`${API_BASE_URL}/category`);
      if (resData.success) setCategories(resData.data || []);
    } catch (error) {
        toast.error(error?.message || String(error) || "Failed to fetch categories")
      //console.error("Error fetching categories:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const createCategory = async (name, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);

      const resData = await apiFetch(`${API_BASE_URL}/category`, {
        method: "POST",
        body: formData,
      });

      if (resData.success) {
        setCategories((prev = []) => [...prev, resData.data]);
        toast.success(resData.message || "Category created successfully!");
      } else {
        toast.error(resData.message || "Failed to create category");
      }

      return resData;
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      let body;
      let headers = {};

      if (updates.image instanceof File) {
        body = new FormData();
        body.append("name", updates.name);
        body.append("image", updates.image);
      } else {
        body = JSON.stringify(updates);
        headers["Content-Type"] = "application/json";
      }

      const resData = await apiFetch(`${API_BASE_URL}/category/${id}`, {
        method: "PUT",
        body,
        headers,
      });

      if (resData.success) {
        setCategories((prev) =>
          prev.map((cat) => (cat._id === id ? resData.data : cat))
        );
        toast.success(resData.message);
        fetchCategories();
      } else {
        toast.error(resData.message);
      }

      return resData;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const resData = await apiFetch(`${API_BASE_URL}/category/${id}`, {
        method: "DELETE",
      });
      if (resData.success) {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- PRODUCT/SERVICE METHODS ----------------
  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      const resData = await apiFetch(`${API_BASE_URL}/service`,{
      });
      if (resData.success) setProducts(resData.data || []);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setProductLoading(false);
    }
  };

  const getProductByCategory = async (id)=>{
    try {
      setProductLoading(true)
      const resData = await apiFetch(`${API_BASE_URL}/service/category/${id}`);
      if (resData.success) setProducts(resData.data || []);
      else toast.error(resData.message)
    } catch (error) {
      toast.error(error.message)
    }
    finally{
      setProductLoading(false)
    }
  }


  const getProductById = async (id)=>{
    try {
      const resData = await apiFetch(`${API_BASE_URL}/service/${id}`);
      if (resData.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? resData.data : p))
        );
      } else {
        toast.error(resData.message);
      }
      return resData;
    } catch (error) {
      toast.error(error.message)
    }
  }

  const createProduct = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, val);
      });

      const resData = await apiFetch(`${API_BASE_URL}/service`, {
        method: "POST",
        body: formData,
      });

      if (resData.success) {
        setProducts((prev) => [...prev, resData.s]);
        toast.success(resData.message);
      } else {
        toast.error(resData.message);
      }

      return resData;
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (id, values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, val);
      });

      const resData = await apiFetch(`${API_BASE_URL}/service/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (resData.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? resData.data : p))
        );
        toast.success(resData.message);
      } else {
        toast.error(resData.message);
      }

      return resData;
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const resData = await apiFetch(`${API_BASE_URL}/service/${id}`, {
        method: "DELETE",
      });

      if (resData.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success(resData.message);
      } else {
        toast.error(resData.message);
      }

      return resData;
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchCartItems();
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <cartContext.Provider
      value={{
        cartItems,
        setCartItems,
        loading,
        fetchCartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      <categoryContext.Provider
        value={{
          categories,
          categoryLoading,
          fetchCategories,
          createCategory,
          updateCategory,
          deleteCategory,
        }}
      >
        <productContext.Provider
          value={{
            products,
            productLoading,
            fetchProducts,
            getProductById,
            getProductByCategory,
            createProduct,
            updateProduct,
            deleteProduct,
          }}
        >
          <SearchContext.Provider
            value={{
              searchQuery,
              setSearchQuery,
            }}
          >
            <SaveCartContext.Provider value={
              {
                saveCart,
                savedCarts,
                getAllSavedCarts,
                getSavedCartById,
                searchSavedCarts,
                deleteSavedCart,
                deleteAllSavedCarts,
                saveCartLoading
              }}
              >
                <CustomerContext.Provider value={{ customer,setCustomer,showCustomer,setShowCustomer}}>
                   {children}
                </CustomerContext.Provider>
            </SaveCartContext.Provider>
          </SearchContext.Provider>
        </productContext.Provider>
      </categoryContext.Provider>
    </cartContext.Provider>
  );
};



// ---------------- HOOKS ----------------
export const useCart = () => useContext(cartContext);
export const useCategory = () => useContext(categoryContext);
export const useProduct = () => useContext(productContext);
export const useSeacrh = () => useContext(SearchContext)
export const useSaveCart = () => useContext(SaveCartContext)
export const useCustomer = () => useContext(CustomerContext)
