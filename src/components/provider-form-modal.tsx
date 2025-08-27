
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Proveedor } from "@/lib/types";
import { saveProvider } from "@/lib/actions";
import { providerSchema, type ProviderFormValues } from "@/lib/schemas_ant";

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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "./ui/separator";

type ProviderFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  provider: Proveedor | null;
};

export function ProviderFormModal({
  isOpen,
  onClose,
  provider,
}: ProviderFormModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!provider;

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
        tipo: 'PRODUCTOS',
        origen: 'NACIONAL',
        dias_credito: 0,
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (provider) {
        form.reset({
            ...provider,
            dias_credito: provider.dias_credito || 0,
        });
      } else {
        form.reset({
          razon_social: "",
          rfc: "",
          email: "",
          telefono: "",
          dias_credito: 0,
          direccion: "",
          persona_contacto: "",
          tipo: "PRODUCTOS",
          origen: "NACIONAL",
        });
      }
    }
  }, [isOpen, provider, form]);

  const handleSubmit = async (values: ProviderFormValues) => {
    setIsSubmitting(true);
    const result = await saveProvider(values, provider?.id);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Editar Proveedor` : 'Agregar Nuevo Proveedor'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualiza los detalles del proveedor.' : 'Completa los campos para registrar un nuevo proveedor.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="razon_social"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Partes Express S.A. de C.V." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="rfc"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>RFC</FormLabel>
                        <FormControl>
                            <Input placeholder="Registro Federal de Contribuyentes" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="dias_credito"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Días de Crédito</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <Separator className="my-4"/>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Proveedor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="PRODUCTOS">Productos</SelectItem>
                                    <SelectItem value="SERVICIOS">Servicios</SelectItem>
                                    <SelectItem value="AMBOS">Ambos</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="origen"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Origen</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="NACIONAL">Nacional</SelectItem>
                                    <SelectItem value="EXTRANJERO">Extranjero</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
             </div>
             <Separator className="my-4"/>
             <FormField
                control={form.control}
                name="persona_contacto"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Persona de Contacto</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej. Juan Pérez" {...field} />
                    </FormControl>
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
                            <Input type="email" placeholder="contacto@proveedor.com" {...field} />
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
                name="direccion"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Calle, número, colonia, ciudad, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Guardar Cambios' : 'Crear Proveedor'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
