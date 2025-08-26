
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, UserX, UserCheck } from "lucide-react";
import type { Usuario, Rol } from "@/lib/types";
import { Badge } from "./ui/badge";
import { useModal } from "@/hooks/use-modal-store";

export function Users({ initialUsers, availableRoles }: { initialUsers: Usuario[], availableRoles: Rol[] }) {
  const { onOpen } = useModal();
  const [users, setUsers] = React.useState(initialUsers);

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
        user.id === userId ? { ...user, activo: !user.activo } : user
    ));
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>
                Administra los usuarios del sistema y sus roles.
              </CardDescription>
            </div>
            <Button onClick={() => onOpen('addUser', { roles: availableRoles })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nombre} {user.apellido_p}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles?.map(role => (
                      <Badge key={role.id} variant="secondary" className="mr-1">{role.nombre}</Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                      <Badge variant={user.activo ? "default" : "destructive"}>
                          {user.activo ? "Activo" : "Inactivo"}
                      </Badge>
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Reestablecer Contraseña</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                          {user.activo ? (
                              <><UserX className="mr-2 h-4 w-4" /> Desactivar</>
                          ) : (
                              <><UserCheck className="mr-2 h-4 w-4" /> Activar</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
