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
import type { Empleado, Usuario } from "@/lib/types";
import { Input } from "./ui/input";
import { VendedorFormModal } from "./vendedor-form-modal";
import { Badge } from "./ui/badge";

export function Vendedores({ initialVendedores, systemUsers }: { initialVendedores: Empleado[], systemUsers: Usuario[] }) {
  const [vendedores, setVendedores] = React.useState(
    initialVendedores.filter((e) => e.puesto === "Ejecutiva de Ventas") // TODO: Filter by role ID
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const handleSave = (values: any) => {
    console.log("Saving seller data:", values);
    // Here you would add logic to update the employee record
    setIsModalOpen(false);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vendedores</CardTitle>
              <CardDescription>
                Administra las cuotas y el desempeño de tu equipo de ventas.
              </CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Vendedor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cuota de Venta (Mensual)</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendedores.map((vendedor) => (
                <TableRow key={vendedor.id}>
                  <TableCell className="font-medium">{vendedor.nombre}</TableCell>
                  <TableCell>
                      <Badge variant="secondary">{vendedor.slug_vendedor}</Badge>
                  </TableCell>
                  <TableCell>{vendedor.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>$</span>
                      <Input
                        type="number"
                        defaultValue={vendedor.meta_venta_mensual || 0}
                        className="w-32"
                      />
                    </div>
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
                        <DropdownMenuItem>Guardar Cambios</DropdownMenuItem>
                        <DropdownMenuItem>Ver Desempeño</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <VendedorFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        allEmployees={initialVendedores}
        allUsers={systemUsers}
      />
    </>
  );
}
