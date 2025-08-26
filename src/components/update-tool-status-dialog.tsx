
"use client";

import * as React from "react";
import type { Herramienta } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

type UpdateToolStatusDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (toolId: number, newStatus: Herramienta["estado"]) => void;
  tool: Herramienta | null;
  newStatus?: Herramienta["estado"];
};

export function UpdateToolStatusDialog({
  isOpen,
  onClose,
  onConfirm,
  tool,
  newStatus,
}: UpdateToolStatusDialogProps) {

  const handleConfirm = () => {
    if (tool && newStatus) {
      onConfirm(tool.id, newStatus);
    }
  };

  const getActionText = () => {
    if (!newStatus) return { title: "", description: "", button: "" };
    switch (newStatus) {
      case "EN_MANTENIMIENTO":
        return {
          title: "¿Enviar a Mantenimiento?",
          description: `Esto cambiará el estado de "${tool?.nombre}" a "En Mantenimiento" y no estará disponible para asignación.`,
          button: "Sí, enviar",
        };
      case "DE_BAJA":
        return {
          title: "¿Dar de Baja la Herramienta?",
          description: `Esta acción es irreversible y marcará la herramienta "${tool?.nombre}" como fuera de servicio.`,
          button: "Sí, dar de baja",
        };
      default:
        return { title: "", description: "", button: "" };
    }
  };

  const { title, description, button } = getActionText();
  const isDestructive = newStatus === 'DE_BAJA';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className={isDestructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}>
            {button}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
