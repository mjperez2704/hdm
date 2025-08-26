
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Building, Contact, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import Image from "next/image";

const formSchema = z.object({
  legalName: z.string().min(1, "La razón social es requerida."),
  tradeName: z.string().min(1, "El nombre comercial es requerido."),
  rfc: z.string().min(12, "El RFC debe tener al menos 12 caracteres.").max(13, "El RFC no puede tener más de 13 caracteres."),
  taxRegime: z.string().min(1, "El régimen fiscal es requerido."),
  
  street: z.string().min(1, "La calle es requerida."),
  exteriorNumber: z.string().min(1, "El número exterior es requerido."),
  interiorNumber: z.string().optional(),
  neighborhood: z.string().min(1, "La colonia es requerida."),
  city: z.string().min(1, "La ciudad es requerida."),
  state: z.string().min(1, "El estado es requerido."),
  zipCode: z.string().min(5, "El código postal es requerido."),

  phone1: z.string().optional(),
  phone2: z.string().optional(),
  email: z.string().email("El email no es válido.").optional().or(z.literal('')),
  website: z.string().url("La URL no es válida.").optional().or(z.literal('')),
});

export function CompanyProfileForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // TODO: Cargar estos valores desde la base de datos
    defaultValues: {
      legalName: "Hospital del Móvil S.A. de C.V.",
      tradeName: "Hospital del Móvil",
      rfc: "HMO123456789",
      taxRegime: "Régimen de Incorporación Fiscal",
      street: "Av. Siempre Viva",
      exteriorNumber: "742",
      interiorNumber: "",
      neighborhood: "Centro",
      city: "Springfield",
      state: "CDMX",
      zipCode: "06000",
      phone1: "55-1234-5678",
      phone2: "55-9876-5432",
      email: "contacto@hospitaldelmovil.com",
      website: "https://www.hospitaldelmovil.com",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Guardando datos de la empresa:", values);
    toast({
      title: "Datos Guardados",
      description: "La información de la empresa ha sido actualizada correctamente.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Columna de Tarjetas */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building /> Información Fiscal</CardTitle>
                <CardDescription>
                  Datos para facturación y registros oficiales.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="legalName" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Nombre o Razón Social</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )}/>
                  <FormField control={form.control} name="tradeName" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Nombre Comercial</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                  )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="rfc" render={({ field }) => (
                      <FormItem>
                          <FormLabel>RFC</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                  )}/>
                   <FormField control={form.control} name="taxRegime" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Régimen Fiscal</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                  )}/>
                </div>
                <Separator />
                <FormLabel className="text-base">Dirección Fiscal</FormLabel>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="street" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Calle</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                    )}/>
                     <FormField control={form.control} name="exteriorNumber" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Número Exterior</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                    )}/>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="interiorNumber" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Número Interior (opcional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                    )}/>
                     <FormField control={form.control} name="neighborhood" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Colonia</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                    )}/>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormField control={form.control} name="zipCode" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Código Postal</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                    )}/>
                     <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Ciudad / Municipio</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                    )}/>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Contact /> Información de Contacto</CardTitle>
                <CardDescription>
                  Datos de contacto público y administrativo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone1" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Teléfono Principal</FormLabel>
                          <FormControl><Input type="tel" {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                  )}/>
                   <FormField control={form.control} name="phone2" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Teléfono Secundario (opcional)</FormLabel>
                          <FormControl><Input type="tel" {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                  )}/>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Email de Contacto</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                  )}/>
                   <FormField control={form.control} name="website" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Sitio Web (opcional)</FormLabel>
                          <FormControl><Input type="url" {...field} /></FormControl>
                           <FormMessage />
                      </FormItem>
                  )}/>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna de Logo */}
          <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe /> Logotipo</CardTitle>
                    <CardDescription>Sube el logotipo de tu empresa.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                     <div className="w-48 h-48 flex items-center justify-center bg-muted rounded-full">
                        <Image src="https://hospitaldelmovil.mega-shop-test.shop/shared/logo.png" alt="Logo actual" width={176} height={176} className="object-contain rounded-full" />
                     </div>
                     <Button variant="outline" type="button" disabled>
                        <Upload className="mr-2 h-4 w-4" /> Cambiar Logotipo
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
    </Form>
  );
}
