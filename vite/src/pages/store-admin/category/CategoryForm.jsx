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
import { CategorySchema } from "../../../auth/forms/category-schema";
import { Link } from "react-router";
import { CircleXIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function CategoryForm({
  mode = "create", // "create" | "edit"
  initialData = { name: "", image: null },
  onSubmitForm,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const {theme} = useTheme()

  const form = useForm({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData,
  });

  // ✅ Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [JSON.stringify(initialData)]);

  async function onSubmit(values) {
    try {
      setIsProcessing(true);
      setError(null);

      // ✅ Preserve old image if no new file selected
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
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Add Category" : "Edit Category"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Add your product category"
              : "Update your product category"}
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

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`${theme === 'dark' ? 'text-black' : ''}`}>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" className='bg-white' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`${theme === 'dark' ? 'text-black' : ''}`}>Upload Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file || initialData.image); // ✅ keep old image if no file selected
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
            "Create Category"
          ) : (
            "Update Category"
          )}
        </Button>
        <div className=" absolute top-0 right-0">
          <Link to={'/store-admin/inventory/all-categories'}><CircleXIcon /></Link>
        </div>
      </form>
    </Form>
  );
}
