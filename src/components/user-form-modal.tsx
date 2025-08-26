
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Rol } from "@/lib/types";

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
  FormDescription,
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
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido_p: z.string().min(1, "El apellido es requerido."),
  email: z.string().email("El email no es válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  roles: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Debe seleccionar al menos un rol.",
  }),
  forcePasswordChange: z.boolean().default(false),
  passwordNeverExpires: z.boolean().default(false),
  expiryValue: z.coerce.number().int().min(1).default(3),
  expiryUnit: z.enum(["dias", "meses", "anios"]).default("meses"),
});

type UserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  roles: Rol[];
};

export function UserFormModal({
  isOpen,
  onClose,
  onSave,
  roles,
}: UserFormModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido_p: "",
      email: "",
      password: "",
      forcePasswordChange: true,
      passwordNeverExpires: false,
      expiryValue: 3,
      expiryUnit: "meses",
      roles: [],
    },
  });

  const passwordNeverExpires = form.watch("passwordNeverExpires");

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Saving user:", values);
    onSave(values);
    form.reset();
    toast({
      title: "Usuario Guardado",
      description: "El nuevo usuario ha sido guardado exitosamente (simulado).",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Complete los campos para registrar un nuevo usuario en el sistema.
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
                        <FormLabel>Nombre(s)</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej. Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="apellido_p"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Apellido(s)</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej. Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="usuario@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contraseña Temporal</FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="roles"
                render={() => (
                    <FormItem>
                        <FormLabel>Roles</FormLabel>
                         <FormDescription>
                            Seleccione uno o más roles para el usuario.
                        </FormDescription>
                        <ScrollArea className="h-32 w-full rounded-md border p-4">
                            {roles.map((rol) => (
                                <FormField
                                key={rol.id}
                                control={form.control}
                                name="roles"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={rol.id}
                                        className="flex flex-row items-start space-x-3 space-y-0 mb-3"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(String(rol.id))}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...(field.value || []), String(rol.id)])
                                                : field.onChange(
                                                    (field.value || []).filter(
                                                    (value) => value !== String(rol.id)
                                                    )
                                                );
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {rol.nombre}
                                        </FormLabel>
                                    </FormItem>
                                    );
                                }}
                                />
                            ))}
                        </ScrollArea>
                        <FormMessage />
                    </FormItem>
                )}
            />
            
            <Separator />
            <h3 className="text-lg font-medium">Políticas de Contraseña</h3>

            <FormField
                control={form.control}
                name="forcePasswordChange"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <FormLabel>Forzar cambio de contraseña</FormLabel>
                            <FormDescription>
                                El usuario deberá cambiar su contraseña en el próximo inicio de sesión.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="passwordNeverExpires"
                render={({ field }) => (
                     <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <FormLabel>La contraseña nunca caduca</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <FormField
                    control={form.control}
                    name="expiryValue"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Caduca cada</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} disabled={passwordNeverExpires}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="expiryUnit"
                    render={({ field }) => (
                         <FormItem>
                            <FormLabel>&nbsp;</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={passwordNeverExpires}>
                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="dias">día(s)</SelectItem>
                                    <SelectItem value="meses">mes(es)</SelectItem>
                                    <SelectItem value="anios">año(s)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar Usuario</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
