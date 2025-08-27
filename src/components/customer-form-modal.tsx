
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Cliente } from "@/lib/types";
import { saveCustomer } from "@/lib/actions";
import { customerSchema, type CustomerFormValues } from "@/lib/schemas_ant";


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

type CustomerFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customer: Cliente | null;
};

export function CustomerFormModal({
  isOpen,
  onClose,
  customer,
}: CustomerFormModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!customer;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      razon_social: "",
      rfc: "",
      email: "",
      telefono: "",
      tipo_id: 1, // Default to Cliente Final
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (customer) {
        form.reset({
          ...customer,
          rfc: customer.rfc || "",
          email: customer.email || "",
          telefono: customer.telefono || "",
        });
      } else {
        form.reset({
          razon_social: "",
          rfc: "",
          email: "",
          telefono: "",
          tipo_id: 1,
        });
      }
    }
  }, [isOpen, customer, form]);

  const handleSubmit = async (values: CustomerFormValues) => {
    setIsSubmitting(true);
    const result = await saveCustomer(values, customer?.id);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      });
      onClose();
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Editar Cliente` : 'Agregar Nuevo Cliente'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualiza los detalles del cliente.' : 'Completa los campos para registrar un nuevo cliente.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="razon_social"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre / Razón Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cliente</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Cliente Final</SelectItem>
                      <SelectItem value="2">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="contacto@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej. 55 1234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="rfc"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>RFC (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Registro Federal de Contribuyentes" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
