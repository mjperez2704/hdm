
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Marca, Modelo } from "@/lib/types";
import { saveModel } from "@/lib/actions";
import { modelSchema, type ModelFormValues } from "@/lib/schemas";

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

type ModelFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  brand: Marca | null;
  model: Modelo | null;
};

export function ModelFormModal({
  isOpen,
  onClose,
  brand,
  model
}: ModelFormModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!model;

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
  });

  React.useEffect(() => {
    if (isOpen) {
      if (model) {
        form.reset({
          nombre: model.nombre,
          anio: model.anio,
        });
      } else {
         form.reset({ nombre: "", anio: new Date().getFullYear() });
      }
    }
  }, [isOpen, model, form]);

  const handleSubmit = async (values: ModelFormValues) => {
    if(!brand?.id) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se ha especificado una marca para este modelo.",
        });
        return;
    }
    
    setIsSubmitting(true);
    const result = await saveModel(values, brand.id, model?.id);
    setIsSubmitting(false);

    if(result.success) {
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
          <DialogTitle>{isEditing ? `Editar Modelo: ${model?.nombre}` : 'Agregar Nuevo Modelo'}</DialogTitle>
          <DialogDescription>
            Agregando/editando un modelo para la marca: <strong>{brand?.nombre}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. iPhone 15 Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año de Lanzamiento (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej. 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Guardar Cambios' : 'Crear Modelo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
