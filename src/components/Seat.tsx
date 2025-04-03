"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";

import { z } from "zod";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().nonempty("Name is required!"),
  email: z.string().email("Enter a valid email!"),
  address: z.string().nonempty("Addres is required!"),
  phone: z
    .string()
    .min(10, { message: "Must be a valid mobile number" })
    .max(14, { message: "Must be a valid mobile number" }),
});

export default function Seat({
  seat,
  fetchBookings,
}: {
  seat: any;
  fetchBookings: () => Promise<void>;
}) {
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  const formArray: {
    name: "name" | "email" | "phone" | "address";
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "name",
      label: "Name",
      placeholder: "Roy...",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "roy13@gmail.com",
    },
    {
      name: "address",
      label: "Address",
      placeholder: "1234 Elm Street, Springfield, IL 62701, USA",
    },
    {
      name: "phone",
      label: "Phone",
      placeholder: "99xxx99",
    },
  ];

  // ON SUBMIT
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addDoc(collection(db, "bookings"), {
        ...values,
        seat: seat.identifier, // Add the seat identifier
        createdAt: new Date(), // Optional: timestamp
      });
      fetchBookings();

      console.log("Booking successful:", values);
      setIsDialogueOpen(false);
    } catch (error) {
      console.error("Error booking seat:", error);
    }
  }

  if (seat.isBooked)
    return (
      <div className="w-[64px] h-[64px] border-sky-300 border bg-sky-500 flex items-center justify-center rounded-sm">
        <p className="text-sm font-medium">{seat.identifier}</p>
      </div>
    );

  return (
    <Dialog
      open={isDialogueOpen}
      onOpenChange={(state) => setIsDialogueOpen(state)}
    >
      <DialogTrigger asChild onClick={() => setIsDialogueOpen(true)}>
        <div className="w-[64px] h-[64px] bg-gray-300 border border-gray-500 flex items-center justify-center rounded-sm cursor-pointer hover:bg-gray-400">
          <p className="text-sm font-medium">{seat.identifier}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Book {seat.identifier}</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {formArray.map((f) => (
              <FormField
                // disabled={isWorking}
                key={f.name}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={f.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter>
              <Button type="submit">Book</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
