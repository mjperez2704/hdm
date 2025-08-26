"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/use-modal-store";
import { userFormConfig } from "@/lib/modal-configs";
import type { ModalConfig } from "@/lib/modal-configs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function DynamicModal() {
  const { isOpen, onClose, type, data } = useModal();
  const { toast } = useToast();
  const isModalOpen = isOpen;

  // Determina qué configuración usar
  const modalConfig: ModalConfig | null = React.useMemo(() => {
    if (type === "addUser" && data.roles) {
      return userFormConfig(data.roles);
    }
    // Agrega más casos para otros tipos de modales
    // if (type === "assignTool") return assignToolConfig(data.employees);
    return null;
  }, [type, data]);

  const form = useForm({
    resolver: modalConfig ? zodResolver(modalConfig.schema) : undefined,
    defaultValues: {},
  });

  React.useEffect(() => {
    // Resetea el formulario cuando el modal cambia o se cierra
    if (modalConfig) {
      form.reset();
    }
  }, [modalConfig, form]);

  if (!modalConfig) {
    return null;
  }

  const onSubmit = async (values: any) => {
    try {
      console.log("Datos del formulario:", values);
      // Aquí es donde llamarías a tu Server Action o API
      // Ejemplo: await createUserAction(values);
      toast({ title: "Éxito", description: `${modalConfig.title} completado.` });
      form.reset();
      onClose();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Ocurrió un error." });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalConfig.title}</DialogTitle>
          <DialogDescription>{modalConfig.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {modalConfig.fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === "select" ? (
                        <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Selecciona un ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input type={field.type} placeholder={field.placeholder} {...formField} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter>
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}