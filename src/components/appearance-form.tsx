
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, Upload, Palette, Text, ScreenShare, Loader, PlayCircle, Timer } from "lucide-react";
import { Separator } from "./ui/separator";

// Helper para convertir HEX a HSL string "H S% L%"
const hexToHslString = (hex: string): string => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};


const formSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color HEX válido (ej. #RRGGBB)"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color HEX válido (ej. #RRGGBB)"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color HEX válido (ej. #RRGGBB)"),
  splashDuration: z.coerce.number().int().min(1, "La duración debe ser de al menos 1 segundo.").max(20, "La duración no puede exceder los 20 segundos.")
});

export function AppearanceForm() {
    const { toast } = useToast();
    
    // TODO: Obtener estos valores de la configuración guardada
    const defaultValues = {
        primaryColor: "#990000", // Valor de --primary en HSL(359 89% 22%)
        accentColor: "#b80200",  // Valor de --accent en HSL(0 99% 36%)
        backgroundColor: "#F0F8FF", // Valor de --background en HSL(208 100% 97%)
        splashDuration: 5,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    
    const primaryColor = form.watch('primaryColor');
    const accentColor = form.watch('accentColor');
    const backgroundColor = form.watch('backgroundColor');

    React.useEffect(() => {
        if (form.formState.isValid) {
            document.documentElement.style.setProperty('--primary', hexToHslString(primaryColor));
            document.documentElement.style.setProperty('--ring', hexToHslString(primaryColor));
            document.documentElement.style.setProperty('--accent', hexToHslString(accentColor));
            document.documentElement.style.setProperty('--background', hexToHslString(backgroundColor));
            document.documentElement.style.setProperty('--card', hexToHslString(backgroundColor));
            document.documentElement.style.setProperty('--popover', hexToHslString(backgroundColor));
        }
    }, [primaryColor, accentColor, backgroundColor, form.formState.isValid]);


    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Guardando configuración de apariencia:", values);
        toast({
            title: "Apariencia Guardada",
            description: "Los nuevos ajustes de apariencia han sido guardados (simulado).",
        });
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colores */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette/> Colores del Tema</CardTitle>
                    <CardDescription>
                        Define la paleta de colores principal de la aplicación.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="primaryColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Text/> Color Primario (Botones, Títulos)</FormLabel>
                                <div className="flex items-center gap-2">
                                <Input {...field} className="max-w-xs" />
                                <FormControl>
                                    <Input type="color" {...field} className="w-12 h-10 p-1"/>
                                </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accentColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><ImageIcon/> Color de Acento (Énfasis, Hover)</FormLabel>
                                <div className="flex items-center gap-2">
                                <Input {...field} className="max-w-xs" />
                                <FormControl>
                                    <Input type="color" {...field} className="w-12 h-10 p-1"/>
                                </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="backgroundColor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><ScreenShare/> Color de Fondo</FormLabel>
                                <div className="flex items-center gap-2">
                                <Input {...field} className="max-w-xs" />
                                <FormControl>
                                    <Input type="color" {...field} className="w-12 h-10 p-1"/>
                                </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Opening/Splash Screen */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PlayCircle /> Pantalla de Bienvenida</CardTitle>
                    <CardDescription>
                       Configura la presentación inicial de la aplicación.
                    </CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2 p-4 border rounded-lg bg-muted/40">
                       <FormLabel className="flex items-center gap-2"><Upload /> Video/Imagen de Fondo</FormLabel>
                       <FormDescription>Sube un archivo PNG, JPG, GIF o MP4.</FormDescription>
                       <Button variant="outline" disabled>Cargar Archivo</Button>
                    </div>
                     <FormField
                        control={form.control}
                        name="splashDuration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Timer/> Duración (segundos)</FormLabel>
                                <FormControl>
                                    <Input type="number" className="max-w-xs" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
        
        <Separator/>

        <div className="flex justify-end">
            <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
    </Form>
  );
}
