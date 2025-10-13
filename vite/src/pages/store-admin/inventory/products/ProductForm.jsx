import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle, Check, LoaderCircleIcon } from "lucide-react";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCategory } from "../../../store-client/components/sheets/CartContext";
import { ProductSchema } from "../../../../auth/forms/Produc-schema";
import { Link } from "react-router-dom";
import { CircleXIcon } from "lucide-react";
import { useTheme } from "next-themes";


export function ProductForm({
  mode = "create", // "create" | "edit"
  initialData = {
    serviceName: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    duration: "",
    image: null,
  },
  onSubmitForm,
}) {
  const { categories, fetchCategories } = useCategory();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const {theme} = useTheme()

  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData,
  });

  // ✅ Reset when editing
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [JSON.stringify(initialData)]);

  // ✅ Load categories for dropdown
  useEffect(() => {
    fetchCategories();
  }, []);

  async function onSubmit(values) {
    try {
      setIsProcessing(true);
      setError(null);

      const payload = {
        ...values,
        image: values.image || initialData.image,
      };

      const res = await onSubmitForm(payload);

      if (res?.success) {
        setSuccessMessage(res.message);
      } else {
        setError(res?.message);
      }
    } catch (err) {
      setError(err.message || "Unexpected error");
      setSuccessMessage(null);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`block relative w-full space-y-5 ${theme === 'dark' ? 'text-black' : ''}`}
      >
        <div className="text-center space-y-1 pb-3">
          <h1 className={`text-2xl font-semibold tracking-tight `}>
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Add a new service/product"
              : "Update service/product"}
          </p>
        </div>

        {/* Errors / Success */}
        {error && (
          <Alert
            variant="destructive"
            appearance="light"
            onClose={() => setError(null)}
          >
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        {successMessage && (
          <Alert appearance="light" onClose={() => setSuccessMessage(null)}>
            <AlertIcon>
              <Check />
            </AlertIcon>
            <AlertTitle>{successMessage}</AlertTitle>
          </Alert>
        )}

        {/* Service Name */}
        <FormField
        
          control={form.control}
          name="serviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`${theme === 'dark' ? 'text-black' : ''}`}>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product/service name" {...field} className={`bg-white text-black`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`${theme === 'dark' ? 'text-black' : ''}`}>Description</FormLabel>
              <FormControl>
                <Textarea
                className={`bg-white text-black`}
                  rows={3}
                  placeholder="Enter product description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel  className={`${theme === 'dark' ? 'text-black' : ''}`}>Category</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded-md border p-2"
                  required
                >
                  <option value="" hidden>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price + Discount */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${theme === 'dark' ? 'text-black' : ''}`}>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter price" {...field} className={`bg-white text-black`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel  className={`${theme === 'dark' ? 'text-black' : ''}`}>Discount Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter discount price"
                    {...field}
                    className={`bg-white text-black`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel  className={`${theme === 'dark' ? 'text-black' : ''}`}>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter duration"
                  {...field}
                  className={`bg-white text-black`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel  className={`${theme === 'dark' ? 'text-black' : ''}`}>Upload Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file || initialData.image);
                  }}
                 
                />
              </FormControl>
              <FormMessage />

              {/* Preview old or new */}
              {field.value && typeof field.value === "string" && (
                <img
                  src={field.value}
                  alt="Preview"
                  className="mt-2 w-20 h-20 rounded-md object-cover"
                />
              )}
              {field.value instanceof File && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Selected file: {field.value.name}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </span>
          ) : mode === "create" ? (
            "Create Product"
          ) : (
            "Update Product"
          )}
        </Button>
          <div className=" absolute top-0 right-0">
          <Link to={'/store-admin/inventory/all-products'}><CircleXIcon /></Link>
        </div>
      </form>
    </Form>
  );
}
