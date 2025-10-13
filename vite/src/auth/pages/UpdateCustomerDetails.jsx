'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircleIcon, AlertCircle, CircleX } from "lucide-react";

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

import { addCustomerSchema } from "../forms/customer-schema"; // reuse schema
import { useNavigate, useParams } from "react-router";
import { CustomAdapter } from "../adapters/custome-adapter";

export function UpdateCustomerDetails() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams(); // customer id from route
  const navigate = useNavigate();

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

  // Fields config
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

  // ✅ Load existing customer
  useEffect(() => {
    async function fetchCustomer() {
      try {
        const data = await CustomAdapter.customerDetailsById(id);
        // console.log(data)
        if (data.data) {
          form.reset({
            name: data.data.name || "",
            email: data.data.email || "",
            phone: data.data.phone || "",
            city: data.data.city || "",
            street: data.data.street || "",
            postCode: data.data.postCode || "",
            state: data.data.state || "",
            country: data.data.country || "",
          });
        }
      } catch (err) {
        setError("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id, form]);

  // ✅ Update customer
  async function handleSubmit(values) {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await CustomAdapter.updateCustomer(id, values);

      if (res.success) {
        setSuccessMessage("Customer updated successfully!");
        navigate("/store-admin/all-customers");
      } else {
        setError(res.message || "Failed to update customer");
      }
    } catch (err) {
      setError(err.message || "Unexpected error. Please try again.");
      setSuccessMessage(null);
    } finally {
      setIsProcessing(false);
    }
  }

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="block relative w-full space-y-5"
      >
        <div className="text-center space-y-1 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">Update Customer</h1>
          <p className="text-sm text-muted-foreground">
            Modify existing customer details
          </p>
        </div>
        <div
          onClick={() => navigate("/store-admin/all-customers")}
          className="absolute top-0 right-0 cursor-pointer"
        >
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
                  <Input
                    {...f}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                  />
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
              Updating customer...
            </span>
          ) : (
            "Update Customer"
          )}
        </Button>
      </form>
    </Form>
  );
}
