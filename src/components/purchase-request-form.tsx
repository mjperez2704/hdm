
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import type { Proveedor, Producto } from "@/lib/types";

const purchaseItemSchema = z.object({
  productId: z.string().min(1, "Debe seleccionar un producto."),
  quantity: z.coerce.number().positive("La cantidad debe ser mayor a cero."),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

const formSchema = z.object({
  providerId: z.string().min(1, "Debe seleccionar un proveedor."),
  items: z.array(purchaseItemSchema).min(1, "Debe agregar al menos un artículo."),
});

type PurchaseRequestFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  providers: Proveedor[];
  products: Producto[];
};

export function PurchaseRequestForm({
  isOpen,
  onClose,
  onSave,
  providers,
  products
}: PurchaseRequestFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ productId: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const watchedItems = form.watch('items');

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crear Solicitud de Compra</DialogTitle>
          <DialogDescription>
            Complete el formulario para generar una nueva solicitud de compra que requerirá aprobación.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto p-1">
                <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                    <FormItem className="mb-4">
                    <FormLabel>Proveedor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un proveedor" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {providers.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                            {p.razon_social}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div>
                <FormLabel>Artículos</FormLabel>
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-2 border rounded-md mb-2">
                        <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field }) => (
                            <FormItem className="col-span-5">
                                {index === 0 && <FormLabel>Producto</FormLabel>}
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {products.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.nombre} ({p.sku})
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                            <FormItem className="col-span-2">
                                {index === 0 && <FormLabel>Cant.</FormLabel>}
                                <FormControl>
                                <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`items.${index}.price`}
                            render={({ field }) => (
                            <FormItem className="col-span-3">
                                {index === 0 && <FormLabel>Costo Unitario</FormLabel>}
                                <FormControl>
                                <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <div className="col-span-2 flex items-center gap-1">
                            <p className="text-sm font-medium w-full text-right">
                                {
                                   ( (watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.price || 0)).toFixed(2)
                                }
                            </p>
                            <Button type="button" variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ productId: "", quantity: 1, price: 0 })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar Artículo
                </Button>
                </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Enviar Solicitud</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
