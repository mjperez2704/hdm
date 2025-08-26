
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Marca, Modelo } from "@/lib/types";
import { Badge } from "./ui/badge";
import { BrandFormModal } from "./brand-form-modal";
import { ModelFormModal } from "./model-form-modal";
import { useToast } from "@/hooks/use-toast";
import { deleteBrand, deleteModel } from "@/lib/actions";

type BrandsManagerProps = {
  initialBrands: Marca[];
  initialModels: Modelo[];
};

export function BrandsManager({ initialBrands, initialModels }: BrandsManagerProps) {
  const { toast } = useToast();
  // We no longer need local state for brands and models as revalidation will handle it
  // const [brands, setBrands] = React.useState(initialBrands);
  // const [models, setModels] = React.useState(initialModels);

  // State for modals
  const [isBrandModalOpen, setBrandModalOpen] = React.useState(false);
  const [isModelModalOpen, setModelModalOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<Marca | null>(null);
  const [editingModel, setEditingModel] = React.useState<Modelo | null>(null);
  const [parentBrandForModel, setParentBrandForModel] = React.useState<Marca | null>(null);

  const getModelsForBrand = (brandId: number) => {
    return initialModels.filter(model => model.marca_id === brandId);
  }

  const handleOpenBrandModal = (brand: Marca | null) => {
    setEditingBrand(brand);
    setBrandModalOpen(true);
  };

  const handleOpenModelModal = (model: Modelo | null, brand: Marca) => {
    setEditingModel(model);
    setParentBrandForModel(brand);
    setModelModalOpen(true);
  };

  const handleCloseModals = () => {
    setBrandModalOpen(false);
    setModelModalOpen(false);
    setEditingBrand(null);
    setEditingModel(null);
    setParentBrandForModel(null);
  }

  const handleDeleteBrand = async (brandId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta marca? Todos sus modelos también serán eliminados. Esta acción no se puede deshacer.")) {
        const result = await deleteBrand(brandId);
        if (result.success) {
            toast({
                title: "Marca Eliminada",
                description: result.message,
            });
        } else {
             toast({
                variant: "destructive",
                title: "Error al Eliminar",
                description: result.message,
            });
        }
    }
  };
  
  const handleDeleteModel = async (modelId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este modelo?")) {
        const result = await deleteModel(modelId);
        if (result.success) {
            toast({
                title: "Modelo Eliminado",
                description: result.message,
            });
        } else {
             toast({
                variant: "destructive",
                title: "Error al Eliminar",
                description: result.message,
            });
        }
    }
  };


  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Marcas y Modelos</h1>
          <p className="text-muted-foreground">
            Administra las marcas y modelos de los dispositivos que manejas.
          </p>
        </div>
        <Button onClick={() => handleOpenBrandModal(null)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar Marca
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialBrands.map(brand => {
          const brandModels = getModelsForBrand(brand.id);
          return (
            <Card key={brand.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <span>{brand.nombre}</span>
                      <Badge variant="outline">{brandModels.length} modelos</Badge>
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteBrand(brand.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <CardDescription>
                  {brand.pais_origen ? `País: ${brand.pais_origen}` : "País no especificado"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm mb-2">Modelos:</h4>
                  {brandModels.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {brandModels.map(model => (
                        <li key={model.id} className="flex justify-between items-center group">
                          <span>{model.nombre} ({model.anio})</span>
                           <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenModelModal(model, brand)}>
                                <Edit className="h-3.5 w-3.5" />
                            </Button>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteModel(model.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                           </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay modelos para esta marca.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" size="sm" onClick={() => handleOpenModelModal(null, brand)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Agregar Modelo
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleOpenBrandModal(brand)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar Marca
                </Button>
              </CardFooter>
            </Card>
          );
        })}
         {initialBrands.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="flex flex-col items-center justify-center h-48">
                    <p className="text-muted-foreground">No hay marcas registradas.</p>
                    <Button variant="link" onClick={() => handleOpenBrandModal(null)}>Crea la primera marca</Button>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
    <BrandFormModal
      isOpen={isBrandModalOpen}
      onClose={handleCloseModals}
      brand={editingBrand}
    />
    <ModelFormModal
      isOpen={isModelModalOpen}
      onClose={handleCloseModals}
      brand={parentBrandForModel}
      model={editingModel}
    />
    </>
  );
}
