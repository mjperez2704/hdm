
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Empleado, Usuario } from "@/lib/types";

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
  FormDescription
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
  employeeId: z.string().min(1, "Debe seleccionar un empleado."),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres.").max(10, "El slug no puede tener más de 10 caracteres.").regex(/^[A-Z0-9_]+$/, "El slug solo puede contener mayúsculas, números y guiones bajos."),
  monthlyQuota: z.coerce.number().min(0).default(0),
});

type VendedorFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  allEmployees: Empleado[];
  allUsers: Usuario[];
};

export function VendedorFormModal({
  isOpen,
  onClose,
  onSave,
  allEmployees,
  allUsers,
}: VendedorFormModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        monthlyQuota: 0,
    },
  });

  const selectedEmployeeId = form.watch("employeeId");

  const getLinkedUser = () => {
    if(!selectedEmployeeId) return null;
    const employee = allEmployees.find(e => String(e.id) === selectedEmployeeId);
    if (!employee || !employee.usuario_id) return null;
    return allUsers.find(u => u.id === employee.usuario_id);
  }

  const linkedUser = getLinkedUser();

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
    toast({
      title: "Vendedor Guardado",
      description: "La configuración del vendedor ha sido guardada (simulado).",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar/Configurar Vendedor</DialogTitle>
          <DialogDescription>
            Selecciona un empleado y asígnale un slug y una cuota de venta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empleado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un empleado para configurar como vendedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allEmployees
                        .filter(e => e.puesto === 'Ejecutiva de Ventas') // Show only sales people
                        .map(emp => (
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
             <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Slug (Nombre Corto)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej. VENDEDOR1" {...field} />
                    </FormControl>
                    <FormDescription>
                        Identificador único para ventas, reportes, etc.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="monthlyQuota"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cuota de Venta Mensual ($)</FormLabel>
                    <FormControl>
                        <Input type="number" step="100" placeholder="Ej. 15000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {linkedUser && (
                <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                    <h4 className="font-medium text-sm">Usuario del Sistema Vinculado</h4>
                    <p className="text-sm text-muted-foreground">
                        Este empleado está vinculado al usuario: <span className="font-semibold text-foreground">{linkedUser.email}</span>
                    </p>
                </div>
            )}
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar Configuración</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
