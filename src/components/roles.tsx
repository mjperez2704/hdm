
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
import { PlusCircle, Edit, Trash2, CheckCircle } from "lucide-react";
import type { Rol, Permiso } from "@/lib/types";
import { Badge } from "./ui/badge";
import { RoleFormModal } from "./role-form-modal";

export function Roles({ initialRoles, allPermissions }: { initialRoles: Rol[], allPermissions: Permiso[] }) {
  const [roles, setRoles] = React.useState(initialRoles);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<Rol | null>(null);

  const getPermissionsForRole = (role: Rol): Permiso[] => {
    // En un futuro, esto vendría de la base de datos (tabla rol_permisos)
    // Por ahora, simulamos algunos permisos para cada rol
    if (role.nombre === 'Admin') {
      return allPermissions;
    }
    if (role.nombre === 'Técnico') {
        return allPermissions.filter(p => p.modulo === 'Inventario' || p.modulo === 'Reparaciones');
    }
    if (role.nombre === 'Vendedor') {
        return allPermissions.filter(p => p.modulo === 'Ventas' || p.modulo === 'Clientes' || p.modulo === 'Inventario');
    }
    return [];
  }

  const handleSaveRole = (values: any) => {
    console.log("Saving role:", values);
    // TODO: Implement actual save logic
    setIsModalOpen(false);
  }
  
  const handleOpenModal = (role: Rol | null) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  }

  return (
    <>
      <div>
          <div className="flex justify-between items-center mb-6">
              <div>
                  <h1 className="text-3xl font-bold">Roles y Permisos</h1>
                  <p className="text-muted-foreground">Define qué pueden hacer los usuarios en el sistema.</p>
              </div>
              <Button onClick={() => handleOpenModal(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Rol
              </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => {
                  const rolePermissions = getPermissionsForRole(role);
                  return (
                      <Card key={role.id}>
                          <CardHeader>
                              <CardTitle className="flex justify-between items-center">
                                  <span>{role.nombre}</span>
                                  <Badge variant="outline">{rolePermissions.length} permisos</Badge>
                              </CardTitle>
                              <CardDescription>{role.descripcion}</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <h4 className="font-semibold mb-2 text-sm">Permisos Clave:</h4>
                              <div className="space-y-2">
                                  {rolePermissions.slice(0, 5).map(perm => (
                                      <div key={perm.id} className="flex items-center text-xs">
                                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                          <span>{perm.modulo}: <span className="font-medium">{perm.clave.split('.')[1]}</span></span>
                                      </div>
                                  ))}
                                  {rolePermissions.length > 5 && (
                                      <p className="text-xs text-muted-foreground mt-2">y {rolePermissions.length - 5} más...</p>
                                  )}
                              </div>
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenModal(role)}>
                                  <Edit className="mr-2 h-4 w-4" /> Editar
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                              </Button>
                          </CardFooter>
                      </Card>
                  )
              })}
          </div>
      </div>
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRole}
        role={selectedRole}
        allPermissions={allPermissions}
      />
    </>
  );
}
