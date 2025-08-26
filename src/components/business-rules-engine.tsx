
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Package, Landmark, Settings } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import type { Almacen, Marca } from "@/lib/types";

const modules = [
  { id: "security", name: "Seguridad", icon: Shield },
  { id: "inventory", name: "Inventario", icon: Package },
  { id: "admin", name: "Administración", icon: Landmark },
  { id: "general", name: "General", icon: Settings },
];

type BusinessRulesEngineProps = {
  initialAlmacenes: Almacen[];
  initialMarcas: Marca[];
};

export function BusinessRulesEngine({ initialAlmacenes, initialMarcas }: BusinessRulesEngineProps) {
  const [selectedModule, setSelectedModule] = React.useState("inventory");
  const [almacenes, setAlmacenes] = React.useState(initialAlmacenes);
  const [marcas, setMarcas] = React.useState(initialMarcas);

  // Estados para los selectores de Almacén y Sección
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<string | undefined>();
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | undefined>();
  
  const selectedWarehouse = almacenes.find(a => String(a.id) === selectedWarehouseId);
  const sectionsOfSelectedWarehouse = selectedWarehouse?.secciones || [];


  const renderModuleContent = () => {
    switch (selectedModule) {
      case "inventory":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Inventario</CardTitle>
              <CardDescription>
                Define las restricciones y comportamientos para almacenes, secciones y coordenadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={['general-inventory', 'sections']} className="w-full">
                <AccordionItem value="general-inventory">
                    <AccordionTrigger className="text-lg">Reglas Generales de Inventario</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <Label htmlFor="allow-sale-without-stock" className="flex flex-col space-y-1">
                                <span>Permitir Venta Sin Existencia (Backorder)</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Si se activa, el sistema permitirá vender productos aunque no haya stock, generando un saldo en "Backorder".
                                </span>
                            </Label>
                            <Switch id="allow-sale-without-stock" defaultChecked />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="warehouses">
                  <AccordionTrigger className="text-lg">Reglas de Almacén</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="warehouse-name-unique" className="flex flex-col space-y-1">
                            <span>Nombres de Almacén Únicos</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                No permitir dos almacenes con el mismo nombre. (Regla del sistema)
                            </span>
                        </Label>
                        <Switch id="warehouse-name-unique" defaultChecked disabled />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sections">
                  <AccordionTrigger className="text-lg">Reglas de Sección</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                     <p className="text-sm text-muted-foreground">Define las reglas para una sección específica:</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select onValueChange={setSelectedWarehouseId} value={selectedWarehouseId}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar Almacén..." /></SelectTrigger>
                            <SelectContent>
                                {almacenes.map(almacen => (
                                    <SelectItem key={almacen.id} value={String(almacen.id)}>{almacen.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setSelectedSectionId} value={selectedSectionId} disabled={!selectedWarehouseId}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar Sección..." /></SelectTrigger>
                            <SelectContent>
                               {sectionsOfSelectedWarehouse.map(seccion => (
                                    <SelectItem key={seccion.id} value={String(seccion.id)}>{seccion.nombre}</SelectItem>
                               ))}
                            </SelectContent>
                        </Select>
                     </div>
                     {selectedSectionId && (
                        <>
                        <h4 className="font-semibold pt-4">Condiciones de la sección seleccionada:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                            <FormItem>
                                <FormLabel>Finalidad (USO)</FormLabel>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Definir finalidad..."/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="refacciones">Refacciones</SelectItem>
                                        <SelectItem value="venta">Venta</SelectItem>
                                        <SelectItem value="garantias">Garantías</SelectItem>
                                        <SelectItem value="uso_interno">Uso Interno</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                             <FormItem>
                                <FormLabel>Estatus de SKU</FormLabel>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Definir estatus..."/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nuevo">Nuevo</SelectItem>
                                        <SelectItem value="usado">Usado</SelectItem>
                                        <SelectItem value="por_definir">Por Definir</SelectItem>
                                        <SelectItem value="remanufacturado">Remanufacturado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                            <FormItem>
                                <FormLabel>Marca Permitida</FormLabel>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Definir marca..."/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Cualquier Marca</SelectItem>
                                        {marcas.map(marca => (
                                            <SelectItem key={marca.id} value={String(marca.id)}>{marca.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        </div>
                        </>
                     )}
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="coordinates">
                  <AccordionTrigger className="text-lg">Reglas de Coordenada</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="coordinate-sku-limit" className="flex flex-col space-y-1">
                            <span>Máximo de SKUs distintos por Coordenada</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Define la cantidad máxima de tipos de producto (SKUs) distintos por coordenada.
                            </span>
                        </Label>
                        <Input id="coordinate-sku-limit" type="number" defaultValue={2} className="w-24" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
                <Button>Guardar Reglas de Inventario</Button>
            </CardFooter>
          </Card>
        );
      case "security":
         return (
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Seguridad</CardTitle>
              <CardDescription>
                Define las políticas de acceso y permisos de los usuarios.
              </CardDescription>
            </CardHeader>
             <CardContent>
              <p className="text-muted-foreground">Próximamente.</p>
            </CardContent>
          </Card>
        );
      default:
        return <p>Selecciona un módulo para ver sus reglas.</p>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
      <nav className="flex flex-col gap-2">
        {modules.map((module) => (
          <Button
            key={module.id}
            variant={selectedModule === module.id ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => setSelectedModule(module.id)}
          >
            <module.icon className="mr-2 h-5 w-5" />
            {module.name}
          </Button>
        ))}
      </nav>
      <div>{renderModuleContent()}</div>
    </div>
  );
}

// Dummy FormItem para que funcionen los selectores
const FormItem = ({children}: {children: React.ReactNode}) => <div className="space-y-2">{children}</div>
const FormLabel = ({children}: {children: React.ReactNode}) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>

