
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Almacen, Producto, Coordenada } from "@/lib/types";

const formSchema = z.object({
  transferType: z.enum(["inter-warehouse", "intra-warehouse"]),
  
  // Inter-warehouse
  originWarehouse: z.string().optional(),
  destinationWarehouse: z.string().optional(),
  
  // Intra-warehouse
  warehouse: z.string().optional(),
  
  // Common fields
  originCoordenada: z.string().min(1, "La coordenada de origen es requerida."),
  destinationCoordenada: z.string().min(1, "La coordenada de destino es requerida."),
  product: z.string().min(1, "El producto es requerido."),
  quantity: z.coerce.number().int().positive("La cantidad debe ser un número positivo."),
  transferAll: z.boolean().optional(),
}).refine(data => {
    if (data.transferType === 'inter-warehouse') {
        return !!data.originWarehouse && !!data.destinationWarehouse && data.originWarehouse !== data.destinationWarehouse;
    }
    return true;
}, {
    message: "El almacén de origen y destino deben ser seleccionados y no pueden ser el mismo.",
    path: ["destinationWarehouse"],
}).refine(data => {
    if (data.transferType === 'intra-warehouse') {
        return data.originCoordenada !== data.destinationCoordenada;
    }
    return true;
}, {
    message: "La coordenada de origen y destino no pueden ser la misma.",
    path: ["destinationCoordenada"],
});

type TransferFormProps = {
  almacenes: Almacen[];
  productos: Producto[];
  coordenadas: Coordenada[];
};

export function TransferForm({ almacenes, productos, coordenadas }: TransferFormProps) {
  const { toast } = useToast();
  const [availableQuantity, setAvailableQuantity] = React.useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema.refine(data => {
        if(availableQuantity !== null) {
            return data.quantity <= availableQuantity;
        }
        return true;
    }, {
        message: "La cantidad a trasladar no puede ser mayor que la disponible.",
        path: ["quantity"]
    })),
    defaultValues: {
      transferType: "inter-warehouse",
      quantity: 1,
      transferAll: false,
    },
  });

  const transferType = form.watch("transferType");
  const originWarehouseId = form.watch("originWarehouse");
  const destinationWarehouseId = form.watch("destinationWarehouse");
  const intraWarehouseId = form.watch("warehouse");
  const originCoordenadaId = form.watch("originCoordenada");
  const destinationCoordenadaId = form.watch("destinationCoordenada");
  const productId = form.watch("product");
  const transferAll = form.watch("transferAll");

  React.useEffect(() => {
    if(originCoordenadaId && productId) {
        const coordenada = coordenadas.find(c => String(c.id) === originCoordenadaId && String(c.producto_id) === productId);
        if(coordenada) {
            setAvailableQuantity(coordenada.cantidad);
            if(transferAll) {
                form.setValue('quantity', coordenada.cantidad);
            }
        } else {
            setAvailableQuantity(null);
        }
    } else {
        setAvailableQuantity(null);
    }
  }, [originCoordenadaId, productId, transferAll, form, coordenadas]);


  const getCoordenadasForWarehouse = (warehouseId: string | undefined) => {
    if (!warehouseId) return [];
    return coordenadas.filter(coordenada => String(coordenada.almacen_id) === warehouseId);
  }

  const originCoordenadas = getCoordenadasForWarehouse(transferType === 'inter-warehouse' ? originWarehouseId : intraWarehouseId);
  const destinationCoordenadas = getCoordenadasForWarehouse(transferType === 'inter-warehouse' ? destinationWarehouseId : intraWarehouseId);

  const getProductsInOriginCoordenada = () => {
    if(!originCoordenadaId) return [];
    const coordenadaProductsIds = coordenadas.filter(c => String(c.id) === originCoordenadaId).map(l => l.producto_id);
    return productos.filter(p => coordenadaProductsIds.includes(p.id));
  }
  
  const availableProductsForTransfer = getProductsInOriginCoordenada();


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Valores del formulario de traslado:", values);
    toast({
      title: "Traslado Guardado (Simulado)",
      description: `Se registró el traslado de ${values.quantity} unidades.`,
    });
    form.reset();
    setAvailableQuantity(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traslados de Inventario</CardTitle>
        <CardDescription>
          Gestiona los traslados de inventario entre almacenes o coordenadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="transferType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Traslado</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.reset({
                            ...form.getValues(),
                            transferType: value as any,
                            originWarehouse: undefined,
                            destinationWarehouse: undefined,
                            warehouse: undefined,
                            originCoordenada: undefined,
                            destinationCoordenada: undefined,
                        });
                        setAvailableQuantity(null);
                      }}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="inter-warehouse" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Entre Almacenes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="intra-warehouse" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Entre Coordenadas (mismo almacén)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {transferType === "inter-warehouse" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="originWarehouse" render={({field}) => (
                    <FormItem>
                        <FormLabel>Almacén Origen</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione almacén origen"/></SelectTrigger></FormControl>
                            <SelectContent>{almacenes.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="destinationWarehouse" render={({field}) => (
                    <FormItem>
                        <FormLabel>Almacén Destino</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione almacén destino"/></SelectTrigger></FormControl>
                            <SelectContent>{almacenes.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
              </div>
            )}
            
            {transferType === "intra-warehouse" && (
                 <FormField control={form.control} name="warehouse" render={({field}) => (
                    <FormItem>
                        <FormLabel>Almacén</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un almacén"/></SelectTrigger></FormControl>
                            <SelectContent>{almacenes.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="originCoordenada" render={({field}) => (
                    <FormItem>
                        <FormLabel>Coordenada Origen</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={originCoordenadas.length === 0}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione coordenada origen"/></SelectTrigger></FormControl>
                            <SelectContent>{originCoordenadas.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.codigo_coordenada}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="destinationCoordenada" render={({field}) => (
                    <FormItem>
                        <FormLabel>Coordenada Destino</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={destinationCoordenadas.length === 0}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione coordenada destino"/></SelectTrigger></FormControl>
                            <SelectContent>{destinationCoordenadas.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.codigo_coordenada}</SelectItem>)}</SelectContent>
                        </Select>
                         <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <FormField control={form.control} name="product" render={({field}) => (
                <FormItem>
                    <FormLabel>Producto (SKU)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!originCoordenadaId}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un producto"/></SelectTrigger></FormControl>
                        <SelectContent>{availableProductsForTransfer.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombre} ({p.sku})</SelectItem>)}</SelectContent>
                    </Select>
                    {availableProductsForTransfer.length === 0 && originCoordenadaId && (
                        <FormDescription className="text-destructive">
                            No hay productos en esta coordenada que cumplan con las reglas de la sección de destino.
                        </FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}/>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                 <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cantidad a Trasladar</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} disabled={transferAll}/>
                        </FormControl>
                         {availableQuantity !== null && (
                            <FormDescription>
                                Disponible: {availableQuantity} unidades
                            </FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="transferAll"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 pb-2">
                             <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={availableQuantity === null}
                                />
                            </FormControl>
                            <FormLabel className="font-normal mt-0!">
                                Trasladar todo el stock
                            </FormLabel>
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="flex justify-end">
                <Button type="submit">Registrar Traslado</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
