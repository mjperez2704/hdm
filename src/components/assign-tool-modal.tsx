
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Herramienta, Empleado } from "@/lib/types";

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
import { Button } from "./ui/button";

const formSchema = z.object({
  employeeId: z.string().min(1, "Debe seleccionar un empleado."),
});

type AssignToolModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (toolId: number, employeeId: number) => void;
  tool: Herramienta | null;
  employees: Empleado[];
};

export function AssignToolModal({
  isOpen,
  onClose,
  onAssign,
  tool,
  employees
}: AssignToolModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    // Resetea el formulario cada vez que el modal se abre o cierra
    // para evitar mostrar datos de una selección anterior.
    if (!isOpen) {
      form.reset({ employeeId: "" });
    }
  }, [isOpen, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (tool) {
      onAssign(tool.id, Number(values.employeeId));
    }
    // El onClose que viene de las props se encargará de cerrar y el useEffect limpiará el form.
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Herramienta</DialogTitle>
          <DialogDescription>
            Asignando: <strong>{tool?.nombre}</strong> (SKU: {tool?.sku})
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignar a</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un técnico..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={String(emp.id)}>
                          {emp.nombre} {emp.apellido_p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Asignar Herramienta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
