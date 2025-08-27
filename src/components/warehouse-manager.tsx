
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
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { Almacen, Seccion, Coordenada } from "@/lib/types";
import { WarehouseFormModal } from "./warehouse-form-modal";
import { SectionFormModal } from "./section-form-modal";

type WarehouseManagerProps = {
  initialData: Almacen[];
  coordenadas: Coordenada[];
};

export function WarehouseManager({ initialData, coordenadas }: WarehouseManagerProps) {
  const [warehouses, setWarehouses] = React.useState(initialData);
  
  // State for warehouse modal
  const [isWarehouseModalOpen, setWarehouseModalOpen] = React.useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<Almacen | null>(null);
  
  // State for section modal
  const [isSectionModalOpen, setSectionModalOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<Seccion | null>(null);
  const [parentWarehouseId, setParentWarehouseId] = React.useState<number | null>(null);

  const getCoordenadaForSection = (sectionId: number) => {
      return coordenadas.filter(c => c.seccion_id === sectionId);
  }

  const handleSaveWarehouse = (values: any) => {
    console.log("Saving warehouse", values);
    // TODO: Implement actual save logic
    setWarehouseModalOpen(false);
  };

  const handleSaveSection = (values: any) => {
    console.log("Saving section", values, "for warehouse", parentWarehouseId);
     // TODO: Implement actual save logic
    setSectionModalOpen(false);
  };

  const openWarehouseModal = (warehouse: Almacen | null) => {
    setSelectedWarehouse(warehouse);
    setWarehouseModalOpen(true);
  };

  const openSectionModal = (section: Seccion | null, warehouseId: number) => {
    setSelectedSection(section);
    setParentWarehouseId(warehouseId);
    setSectionModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Almacén</h1>
          <Button onClick={() => openWarehouseModal(null)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Almacén
          </Button>
        </div>
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-4">
                    {warehouse.nombre}
                    <Badge variant="outline">
                      {warehouse.secciones?.length || 0} secciones
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Administra las secciones y coordenadas de este almacén.
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => openSectionModal(null, warehouse.id)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Agregar Sección
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {warehouse.secciones &&
                  warehouse.secciones.map((section) => {
                    const sectionCoordenadas = getCoordenadaForSection(section.id);
                    return (
                        <AccordionItem value={String(section.id)} key={section.id} className="border-b-0">
                        <Card className="mb-2">
                            <AccordionTrigger className="p-4 text-md font-semibold hover:no-underline">
                                <div className="flex justify-between items-center w-full">
                                    <span>{section.nombre}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{sectionCoordenadas.length} Coordenadas</Badge>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openSectionModal(section, warehouse.id)}}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                            <div className="pl-8 pr-4 pb-4 space-y-4">
                                <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-muted-foreground">
                                    Coordenadas en esta sección
                                </h4>
                                <Button variant="outline" size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Agregar Coordenada
                                </Button>
                                </div>
                                {sectionCoordenadas.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {sectionCoordenadas.map(coordenada => (
                                            <Badge key={coordenada.id} variant="outline" className="justify-center py-1">{coordenada.codigo_coordenada}</Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No hay coordenadas en esta sección.
                                    </p>
                                )}
                            </div>
                            </AccordionContent>
                        </Card>
                        </AccordionItem>
                    )
                })}
                {(!warehouse.secciones || warehouse.secciones.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Este almacén no tiene secciones.</p>
                    <Button variant="link" className="mt-2" onClick={() => openSectionModal(null, warehouse.id)}>
                      Agregar la primera sección
                    </Button>
                  </div>
                )}
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => openWarehouseModal(warehouse)}>
                <Edit className="mr-2 h-4 w-4" /> Editar Almacén
              </Button>
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar Almacén
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <WarehouseFormModal
        isOpen={isWarehouseModalOpen}
        onClose={() => setWarehouseModalOpen(false)}
        onSave={handleSaveWarehouse}
        warehouse={selectedWarehouse}
      />

       <SectionFormModal
        isOpen={isSectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        onSave={handleSaveSection}
        section={selectedSection}
      />
    </>
  );
}
