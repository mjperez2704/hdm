
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
  FormDescription,
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
import type { Cliente, Producto, ProductoConStock, Coordenada } from "@/lib/types";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";

const saleItemSchema = z.object({
  productId: z.string().min(1, "Debe seleccionar un producto."),
  quantity: z.coerce.number().positive("La cantidad debe ser mayor a cero."),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

const formSchema = z
  .object({
    clientId: z.string().min(1, "Debe seleccionar un cliente."),
    items: z
      .array(saleItemSchema)
      .min(1, "Debe agregar al menos un artículo."),
    paymentMethod: z.enum(["EFECTIVO", "TARJETA", "TRANSFERENCIA"], {
      required_error: "Debe seleccionar una forma de pago.",
    }),
    discount: z.coerce
      .number()
      .min(0, "El descuento no puede ser negativo.")
      .optional()
      .default(0),
    homeDelivery: z.boolean().default(false),
    deliveryAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.homeDelivery) {
        return !!data.deliveryAddress && data.deliveryAddress.length > 5;
      }
      return true;
    },
    {
      message: "La dirección de entrega es requerida y debe tener al menos 6 caracteres.",
      path: ["deliveryAddress"],
    }
  );

type SaleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  clients: Cliente[];
  products: Producto[];
  coordenadas: Coordenada[];
};

export function SaleFormModal({
  isOpen,
  onClose,
  onSave,
  clients,
  products,
  coordenadas,
}: SaleFormModalProps) {
  const { toast } = useToast();

  const productsWithStock: ProductoConStock[] = React.useMemo(() => products.map(producto => {
    const stock = coordenadas
      .filter(coordenada => coordenada.producto_id === producto.id)
      .reduce((acc, coordenada) => acc + coordenada.cantidad, 0);
    return { ...producto, stock };
  }), [products, coordenadas]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ productId: "", quantity: 1, price: 0 }],
      homeDelivery: false,
      discount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const watchedDiscount = form.watch("discount");
  const homeDelivery = form.watch("homeDelivery");

  const subtotal = React.useMemo(() => 
    watchedItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0),
    [watchedItems]
  );
  
  const total = React.useMemo(() => 
    subtotal - (watchedDiscount || 0),
    [subtotal, watchedDiscount]
  );

  const handleProductSelect = (productId: string, index: number) => {
    const product = products.find((p) => String(p.id) === productId);
    if (product) {
      form.setValue(`items.${index}.price`, product.precio_lista);
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Simulación de validación de stock y backorder
    let backorderWarning = "";
    values.items.forEach(item => {
        const product = productsWithStock.find(p => String(p.id) === item.productId);
        if (product && item.quantity > product.stock) {
            // Suponiendo que la regla de negocio "vender sin stock" está activa
            const needed = item.quantity - product.stock;
            backorderWarning += `Se generó un backorder de ${needed} unidad(es) para ${product.nombre}. `;
        }
    });

    if (backorderWarning) {
        toast({
            title: "Venta con Backorder",
            description: backorderWarning,
            variant: "default",
            duration: 5000,
        });
    }

    onSave(values);
    form.reset({
      clientId: "",
      items: [{ productId: "", quantity: 1, price: 0 }],
      paymentMethod: undefined,
      discount: 0,
      homeDelivery: false,
      deliveryAddress: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Venta</DialogTitle>
          <DialogDescription>
            Complete el formulario para generar una nueva venta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="max-h-[65vh] overflow-y-auto p-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna Izquierda: Items y Totales */}
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.razon_social}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex-grow">
                  <FormLabel>Artículos</FormLabel>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-2 items-end p-2 border rounded-md mb-2"
                    >
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem className="col-span-5">
                            {index === 0 && <FormLabel>Producto</FormLabel>}
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProductSelect(value, index);
                              }}
                              defaultValue={field.value}
                            >
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
                            {index === 0 && <FormLabel>Precio</FormLabel>}
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-2 flex items-center gap-1">
                        <p className="text-sm font-medium w-full text-right">
                          {(
                            (watchedItems?.[index]?.quantity || 0) *
                            (watchedItems?.[index]?.price || 0)
                          ).toFixed(2)}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-8 w-8"
                          onClick={() => remove(index)}
                        >
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
                
                <Separator className="my-4"/>

                <div className="space-y-2 mt-auto">
                    <div className="flex justify-between items-center text-lg">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="m-0">Descuento:</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} className="w-24 h-8"/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                         <span className="font-semibold text-destructive">-${(watchedDiscount || 0).toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-center text-xl font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

              </div>

              {/* Columna Derecha: Pago y Envío */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de Pago</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un método" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                          <SelectItem value="TARJETA">Tarjeta</SelectItem>
                          <SelectItem value="TRANSFERENCIA">
                            Transferencia
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="homeDelivery"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <FormLabel>¿Entrega a Domicilio?</FormLabel>
                                <FormDescription>
                                    Activa esta opción para registrar una dirección de envío.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {homeDelivery && (
                    <FormField
                        control={form.control}
                        name="deliveryAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección de Entrega</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Calle, número, colonia, código postal, ciudad y referencias."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Venta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
