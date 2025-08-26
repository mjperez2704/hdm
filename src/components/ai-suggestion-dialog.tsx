"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Loader2, Bot, Lightbulb } from "lucide-react";
import type { Producto } from "@/lib/types";
import { getAiSuggestionAction } from "@/app/actions";

type AiSuggestionDialogProps = {
  item: Producto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};


export function AiSuggestionDialog({
  item,
  open,
  onOpenChange,
}: AiSuggestionDialogProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [suggestion, setSuggestion] = React.useState<number | null>(null);
  const [reasoning, setReasoning] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(null);
      setSuggestion(null);
      setReasoning(null);

      getAiSuggestionAction(String(item.id))
        .then((result) => {
          if ("error" in result) {
            setError(result.error);
          } else {
            setSuggestion(result.suggestedLevel);
            setReasoning(result.reasoning);
          }
        })
        .catch(() => {
          setError("Ocurrió un error inesperado.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, item.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" /> Sugerencia de Stock por IA
          </DialogTitle>
          <DialogDescription>
            Para el artículo: <strong>{item.nombre}</strong> (SKU: {item.sku})
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Analizando datos históricos...
              </p>
            </div>
          )}
          {error && (
            <div className="text-center text-destructive">
              <p>
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
          {!isLoading && !error && suggestion !== null && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Nivel de Stock Sugerido</p>
                <p className="text-5xl font-bold text-primary">{suggestion}</p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Lightbulb className="h-4 w-4" />
                  Razonamiento
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {reasoning}
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
