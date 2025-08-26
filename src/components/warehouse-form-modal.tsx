
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Almacen } from "@/lib/types";

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

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre del almacén es requerido."),
  clave: z.string().min(1, "La clave es requerida."),
  tipo: z.enum(["PRINCIPAL", "SUCURSAL", "BODEGA", "TRANSITO"]),
});

type WarehouseFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  warehouse: Almacen | null;
};

export function WarehouseFormModal({
  isOpen,
  onClose,
  onSave,
  warehouse,
}: WarehouseFormModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const isEditing = !!warehouse;

  React.useEffect(() => {
    if (isOpen) {
        form.reset(
            warehouse
            ? { ...warehouse }
            : {
                nombre: "",
                clave: "",
                tipo: "SUCURSAL",
              }
        );
    }
  }, [isOpen, warehouse, form]);


  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
     toast({
      title: `Almacén ${isEditing ? 'Actualizado' : 'Guardado'}`,
      description: `El almacén ha sido ${isEditing ? 'actualizado' : 'guardado'} exitosamente (simulado).`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Editar Almacén` : 'Agregar Nuevo Almacén'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualiza los detalles del almacén.' : 'Completa los campos para registrar un nuevo almacén.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
             <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre del Almacén</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej. Almacén de Refacciones" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="clave"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Clave / Código</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej. ALM-REF" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                     <FormItem>
                        <FormLabel>Tipo de Almacén</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="PRINCIPAL">Principal</SelectItem>
                                <SelectItem value="SUCURSAL">Sucursal</SelectItem>
                                <SelectItem value="BODEGA">Bodega</SelectItem>
                                <SelectItem value="TRANSITO">En Tránsito</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
