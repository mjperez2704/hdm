
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Marca } from "@/lib/types";
import { saveBrand } from "@/lib/actions";
import { brandSchema, type BrandFormValues } from "@/lib/schemas";


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


type BrandFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  brand: Marca | null;
};

export function BrandFormModal({
  isOpen,
  onClose,
  brand,
}: BrandFormModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!brand;

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
  });


  React.useEffect(() => {
    if (isOpen) {
      form.reset(
        brand
          ? { ...brand, pais_origen: brand.pais_origen || "" }
          : { nombre: "", pais_origen: "" }
      );
    }
  }, [isOpen, brand, form]);

  const handleSubmit = async (values: BrandFormValues) => {
    setIsSubmitting(true);
    const result = await saveBrand(values, brand?.id);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Editar Marca: ${brand.nombre}` : 'Agregar Nueva Marca'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualiza los detalles de la marca.' : 'Completa los campos para registrar una nueva marca.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Apple" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pais_origen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País de Origen (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. USA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Guardar Cambios' : 'Crear Marca'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
