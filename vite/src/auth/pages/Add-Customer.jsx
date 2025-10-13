import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircleIcon, AlertCircle, CircleX, Link } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";

// 👉 import your adapter API
import { addCustomerSchema } from "../forms/customer-schema";
import { CustomAdapter } from "../adapters/custome-adapter";
import { useNavigate } from "react-router";

export function AddCustomerForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      street: "",
      postCode: "",
      state: "",
      country: "",
    },
  });

  const fields = [
    { name: "name", label: "Name", placeholder: "Enter name" },
    { name: "email", label: "Email", placeholder: "Email address", type: "email" },
    { name: "phone", label: "Phone", placeholder: "Phone number", type: "tel" },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "street", label: "Street", placeholder: "Street address" },
    { name: "postCode", label: "Postal Code", placeholder: "Postal code" },
    { name: "state", label: "State", placeholder: "State" },
    { name: "country", label: "Country", placeholder: "Country" },
  ];

  async function handleSubmit(values) {
    setIsProcessing(true);
    setError(null);
    try {
      // ✅ Direct API call
      const res = await CustomAdapter.addCustomer(values);

      if (res.success) {
        setSuccessMessage("Customer added successfully!");
        form.reset();
         navigate('/')
      } else {
        setError(res.message || "Failed to add customer");
      }
    } catch (err) {
      setError(err.message || "Unexpected error. Please try again.");
      setSuccessMessage(null);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="block relative w-full space-y-5">
        <div className="text-center space-y-1 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">Add Customer</h1>
          <p className="text-sm text-muted-foreground">
            Add a new customer to the system
          </p>
        </div>
        <div onClick={()=> navigate('/')} className=" absolute top-0 right-0 cursor-pointer" >
        <CircleX />
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" onClose={() => setError(null)}>
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        {successMessage && (
          <Alert onClose={() => setSuccessMessage(null)}>
            <AlertIcon>
              <Check />
            </AlertIcon>
            <AlertTitle>{successMessage}</AlertTitle>
          </Alert>
        )}

        {/* Fields */}
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input {...f} type={field.type || "text"} placeholder={field.placeholder} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              Saving customer...
            </span>
          ) : (
            "Add Customer"
          )}
        </Button>
      </form>
    </Form>
  );
}
