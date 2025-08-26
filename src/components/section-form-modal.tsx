
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Seccion } from "@/lib/types";

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

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre de la sección es requerido."),
  clave: z.string().min(1, "La clave es requerida."),
});

type SectionFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  section: Seccion | null;
};

export function SectionFormModal({
  isOpen,
  onClose,
  onSave,
  section,
}: SectionFormModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const isEditing = !!section;

  React.useEffect(() => {
    if (isOpen) {
        form.reset(
            section
            ? { ...section }
            : { nombre: "", clave: "" }
        );
    }
  }, [isOpen, section, form]);


  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
     toast({
      title: `Sección ${isEditing ? 'Actualizada' : 'Guardada'}`,
      description: `La sección ha sido ${isEditing ? 'actualizada' : 'guardada'} exitosamente (simulado).`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Editar Sección` : 'Agregar Nueva Sección'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualiza los detalles de la sección.' : 'Completa los campos para registrar una nueva sección.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
             <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre de la Sección</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej. Vitrina Principal" {...field} />
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
                        <Input placeholder="Ej. VIT-01" {...field} />
                    </FormControl>
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
