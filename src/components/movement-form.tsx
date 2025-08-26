"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import type { Producto } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  itemId: z.string().min(1, "Por favor seleccione un artículo."),
  quantity: z.coerce.number().int().min(1, "La cantidad debe ser al menos 1."),
  origin: z.string().min(1, "El origen es requerido."),
  destination: z.string().min(1, "El destino es requerido."),
  reason: z.string().min(1, "La razón es requerida."),
  osId: z.string().optional(),
});

type MovementFormProps = {
  inventory: Producto[];
  onSave: (updatedItem: any, newLog: any) => void;
};

export function MovementForm({ inventory, onSave }: MovementFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      osId: "",
    },
  });

  const selectedItemId = form.watch("itemId");
  const selectedItem = inventory.find((item) => String(item.id) === selectedItemId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedItem) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Artículo seleccionado no encontrado.",
      });
      return;
    }

    // TODO: Re-implement save logic with the new data structure
    console.log("Valores del formulario de movimiento:", values);
    
    toast({
      title: "Movimiento Guardado (Simulado)",
      description: `Se registró el movimiento de ${values.quantity} x ${selectedItem.nombre}.`,
    });

    // Esta es una simulación. La lógica real necesitaría actualizar el estado.
    // onSave(updatedItem, newLog);

    form.reset();
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>Agregar Movimiento de Inventario</SheetTitle>
        <SheetDescription>
          Registra un nuevo movimiento de stock para cualquier artículo.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objeto/Artículo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un artículo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inventory.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.nombre}
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origen</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el origen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tablero">Tablero</SelectItem>
                    <SelectItem value="Vitrina">Vitrina</SelectItem>
                    <SelectItem value="Estaciones">Estaciones</SelectItem>
                    <SelectItem value="Almacén">Almacén</SelectItem>
                    <SelectItem value="Proveedor">Proveedor</SelectItem>
                    <SelectItem value="Bahía de Reparación">Bahía de Reparación</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destino</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el destino" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tablero">Tablero</SelectItem>
                    <SelectItem value="Vitrina">Vitrina</SelectItem>
                    <SelectItem value="Estaciones">Estaciones</SelectItem>
                    <SelectItem value="Almacén">Almacén</SelectItem>
                    <SelectItem value="Bahía de Reparación">Bahía de Reparación</SelectItem>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón</FormLabel>
                <Select
                  onValuechange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una razón" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stock Inicial">Stock Inicial</SelectItem>
                    <SelectItem value="Venta">Venta</SelectItem>
                    <SelectItem value="Devolución">Devolución</SelectItem>
                    <SelectItem value="Ajuste">Ajuste</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="osId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID de OS (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="ej., OS-12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter>
            <Button type="submit">Guardar Movimiento</Button>
          </SheetFooter>
        </form>
      </Form>
    </>
  );
}
