
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Producto, Proveedor, Marca } from "@/lib/types";

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
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  sku: z.string().min(1, "El SKU es requerido."),
  generateSku: z.boolean().default(false),
  providerId: z.string().optional(),
  alternateProviderId: z.string().optional(),
  providerSku: z.string().optional(),
  deliveryTime: z.coerce.number().int().min(0).default(0),
  minPurchase: z.coerce.number().int().min(1).default(1),
  hasExpiry: z.boolean().default(false),
  expiryDays: z.coerce.number().int().min(1).default(1),
  description: z.string().min(1, "La descripción es requerida."),
  nombre: z.string().min(1, "El nombre del producto es requerido."), // Added for consistency
  brandId: z.string().optional(),
  unit: z.string().min(1, "La unidad es requerida."),
  cost: z.coerce.number().min(0).default(0),
  precio_lista: z.coerce.number().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(0),
  maxStock: z.coerce.number().int().min(0).default(0),
  isInventoriable: z.boolean().default(true),
  isBlocked: z.boolean().default(false),
  isKitPart: z.boolean().default(false),
  kitSku: z.string().optional(),
}).refine(data => !data.isKitPart || (data.isKitPart && data.kitSku), {
    message: "La clave del kit es requerida si el producto es parte de un kit.",
    path: ["kitSku"]
});

type ProductFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  providers: Proveedor[];
  brands: Marca[];
  product: Producto | null;
};

export function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  providers,
  brands,
  product,
}: ProductFormModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        nombre: product.nombre,
        description: product.descripcion || '',
        providerId: product.proveedor_id ? String(product.proveedor_id) : undefined,
        brandId: product.marca_id ? String(product.marca_id) : undefined,
        cost: product.costo_promedio,
        precio_lista: product.precio_lista,
        // Map other fields from product to form fields
        generateSku: false,
        isBlocked: !product.activo,
      });
    } else {
      form.reset({
        generateSku: false,
        deliveryTime: 0,
        minPurchase: 1,
        hasExpiry: false,
        expiryDays: 1,
        cost: 0,
        precio_lista: 0,
        minStock: 0,
        maxStock: 0,
        isInventoriable: true,
        isBlocked: false,
        isKitPart: false,
      });
    }
  }, [product, form]);
  
  const generateSku = form.watch("generateSku");
  const hasExpiry = form.watch("hasExpiry");
  const isKitPart = form.watch("isKitPart");
  const isEditing = !!product;

  React.useEffect(() => {
    if(generateSku) {
        // TODO: Implement actual SKU generation logic
        form.setValue("sku", "SKU-AUTO-12345");
    } else if (!isEditing) {
        form.setValue("sku", "");
    }
  }, [generateSku, isEditing, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
     toast({
      title: `Producto ${isEditing ? 'Actualizado' : 'Guardado'}`,
      description: `El producto ha sido ${isEditing ? 'actualizado' : 'guardado'} exitosamente (simulado).`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Detalles de: ${product.nombre}` : 'Agregar Nuevo Producto'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Revisa o actualiza los detalles del producto.' : 'Complete los campos para registrar un nuevo producto en el catálogo.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="overflow-y-auto pr-6 h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="space-y-4">
                     <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nombre del Producto</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Pantalla iPhone 15" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. PAR-IP15-PAN" {...field} disabled={generateSku || isEditing} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    {!isEditing && <FormField
                        control={form.control}
                        name="generateSku"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel className="!mt-0">Generar automáticamente</FormLabel>
                            </FormItem>
                        )}
                    />}
                    <FormField
                        control={form.control}
                        name="providerId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Proveedor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un proveedor"/></SelectTrigger></FormControl>
                                <SelectContent>{providers.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.razon_social}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="alternateProviderId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Proveedor Alterno</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un proveedor"/></SelectTrigger></FormControl>
                                <SelectContent>{providers.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.razon_social}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descripción detallada del producto" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="brandId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Marca</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una marca"/></SelectTrigger></FormControl>
                                <SelectContent>{brands.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.nombre}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                             <FormItem>
                                <FormLabel>Unidad</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una unidad"/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="PZA">Pieza (PZA)</SelectItem>
                                        <SelectItem value="KIT">Kit</SelectItem>
                                        <SelectItem value="SRV">Servicio</SelectItem>
                                        <SelectItem value="PAQ">Paquete</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="cost"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Costo Promedio</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="precio_lista"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Precio Lista</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="minStock"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Mínimo</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="maxStock"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Máximo</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                     <FormField
                        control={form.control}
                        name="isInventoriable"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <FormLabel>Inventariable</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="isBlocked"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <FormLabel>Bloqueado (Inactivo)</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="hasExpiry"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <FormLabel>Tiene Vigencia</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="expiryDays"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Días de Vigencia</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} disabled={!hasExpiry}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="isKitPart"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <FormLabel>Es Parte de un Kit</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="kitSku"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Clave del Kit</FormLabel>
                            <FormControl>
                                <Input placeholder="SKU del producto kit" {...field} disabled={!isKitPart}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            </div>
            <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Guardar Producto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
