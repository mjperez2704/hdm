
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Rol, Permiso } from "@/lib/types";

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
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ScrollArea } from "./ui/scroll-area";


const formSchema = z.object({
  nombre: z.string().min(1, "El nombre del rol es requerido."),
  descripcion: z.string().optional(),
  permissions: z.array(z.string()).refine(value => value.length > 0, {
    message: "Debe seleccionar al menos un permiso."
  }),
});

type RoleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  role: Rol | null;
  allPermissions: Permiso[];
};

export function RoleFormModal({
  isOpen,
  onClose,
  onSave,
  role,
  allPermissions
}: RoleFormModalProps) {
  const { toast } = useToast();
  const isEditing = !!role;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(
        role
          ? { ...role, permissions: role.permisos?.map(p => p.clave) || [] }
          : { nombre: "", descripcion: "", permissions: [] }
      );
    }
  }, [isOpen, role, form]);
  

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
    toast({
      title: `Rol ${isEditing ? 'Actualizado' : 'Guardado'}`,
      description: `El rol ha sido ${isEditing ? 'actualizado' : 'guardado'} exitosamente (simulado).`,
    });
    onClose();
  };
  
  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    (acc[permission.modulo] = acc[permission.modulo] || []).push(permission);
    return acc;
  }, {} as Record<string, Permiso[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Editar Rol: ${role.nombre}` : 'Agregar Nuevo Rol'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualiza los detalles y permisos del rol.' : 'Define un nuevo rol y los permisos que tendrá.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre del Rol</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej. Gerente de Taller" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                            <Input placeholder="Breve descripción del rol" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base">Permisos</FormLabel>
                    <ScrollArea className="h-72 w-full rounded-md border">
                    <Accordion type="multiple" className="p-4">
                        {Object.entries(groupedPermissions).map(([moduleName, permissions]) => (
                            <AccordionItem key={moduleName} value={moduleName}>
                                <AccordionTrigger>{moduleName}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-2 gap-4">
                                    {permissions.map((permission) => (
                                         <FormItem
                                            key={permission.id}
                                            className="flex flex-row items-center space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(permission.clave)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), permission.clave])
                                                    : field.onChange(
                                                        (field.value || []).filter(
                                                        (value) => value !== permission.clave
                                                        )
                                                    );
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">
                                                {permission.descripcion}
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    </ScrollArea>
                    <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar Rol</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

