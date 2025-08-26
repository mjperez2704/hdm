
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

export type ChecklistItemState = {
  status?: "ok" | "fail";
  notes?: string;
};

export type ChecklistState = Record<string, ChecklistItemState>;

type ChecklistItem = {
  id: string;
  label: string;
};

type ReceptionChecklistProps = {
  items: ChecklistItem[];
  value?: ChecklistState;
  onChange: (value: ChecklistState) => void;
};

export function ReceptionChecklist({
  items,
  value = {},
  onChange,
}: ReceptionChecklistProps) {
  const handleStatusChange = (itemId: string, status: "ok" | "fail" | undefined) => {
    const currentItem = value[itemId] || {};
    const newItem = { ...currentItem, status };
    onChange({ ...value, [itemId]: newItem });
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    const currentItem = value[itemId] || {};
    const newItem = { ...currentItem, notes };
    onChange({ ...value, [itemId]: newItem });
  };

  return (
    <Card className="bg-muted/30">
        <CardContent className="p-0">
            <ScrollArea className="h-96 w-full p-4">
            <div className="space-y-4">
                {items.map((item) => {
                const itemState = value[item.id] || {};
                const isOk = itemState.status === "ok";
                const isFail = itemState.status === "fail";
                
                return (
                    <div key={item.id} className="p-3 border rounded-md bg-background">
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor={`notes-${item.id}`} className="font-medium">{item.label}</Label>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-semibold", isOk && "text-green-600")}>OK</span>
                                <Switch
                                    checked={isOk}
                                    onCheckedChange={(checked) => handleStatusChange(item.id, checked ? 'ok' : 'fail')}
                                />
                                <span className={cn("text-xs font-semibold", isFail && "text-destructive")}>Falla</span>
                            </div>
                        </div>
                        {isFail && (
                            <Textarea
                                id={`notes-${item.id}`}
                                placeholder="Describe la falla..."
                                value={itemState.notes || ""}
                                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                className="mt-2 h-16"
                            />
                        )}
                    </div>
                );
                })}
            </div>
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
