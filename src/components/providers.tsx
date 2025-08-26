
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Proveedor } from "@/lib/types";
import { ProviderFormModal } from "./provider-form-modal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { deleteProvider } from "@/lib/actions";

export function Providers({ initialProviders }: { initialProviders: Proveedor[] }) {
  const { toast } = useToast();
  // No necesitamos estado local, Next.js lo revalida
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<Proveedor | null>(null);

  const handleOpenModal = (provider: Proveedor | null) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setSelectedProvider(null);
    setIsModalOpen(false);
  };

  const handleDeleteProvider = async (providerId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proveedor?")) {
        const result = await deleteProvider(providerId);
        if (result.success) {
            toast({
                title: "Proveedor Eliminado",
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Proveedores</CardTitle>
              <CardDescription>
                Administra tu lista de proveedores desde la base de datos.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenModal(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Proveedor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razón Social</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.razon_social}</TableCell>
                  <TableCell>{provider.email}</TableCell>
                   <TableCell>
                      <Badge variant="outline">{provider.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                      <Badge variant={provider.origen === 'NACIONAL' ? 'secondary' : 'default'}>{provider.origen}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenModal(provider)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProvider(provider.id)}>
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {initialProviders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No se encontraron proveedores en la base de datos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ProviderFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        provider={selectedProvider}
      />
    </>
  );
}
