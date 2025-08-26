"use client";

import * as React from "react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type RichTextEditorProps = React.ComponentPropsWithoutRef<"textarea">;

export function RichTextEditor({ className, ...props }: RichTextEditorProps) {
  const handleAction = () => {
    // In a real implementation, this would modify the textarea content or state.
    console.log("Toolbar action clicked (simulation).");
  };

  return (
    <div className="rounded-lg border">
      <div className="p-2 flex items-center gap-1 flex-wrap border-b bg-muted/50 rounded-t-lg">
        <Select defaultValue="sans" onValueChange={handleAction}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
                <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="sans">Sans-serif (Arial)</SelectItem>
                <SelectItem value="serif">Serif (Times New Roman)</SelectItem>
                <SelectItem value="mono">Monospace (Courier)</SelectItem>
            </SelectContent>
        </Select>
         <Select defaultValue="14" onValueChange={handleAction}>
            <SelectTrigger className="w-[70px] h-8 text-xs">
                <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="20">20</SelectItem>
            </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button variant="outline" size="icon" onClick={handleAction} type="button" className="h-8 w-8">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleAction} type="button" className="h-8 w-8">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleAction} type="button" className="h-8 w-8">
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="relative h-8 w-8">
          <Button variant="outline" size="icon" onClick={() => document.getElementById('color-picker')?.click()} type="button" className="h-8 w-8">
            <Palette className="h-4 w-4" />
          </Button>
          <input
            id="color-picker"
            type="color"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => console.log("Color selected:", e.target.value)}
          />
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button variant="outline" size="icon" onClick={handleAction} type="button" className="h-8 w-8">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleAction} type="button" className="h-8 w-8">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleAction} type="button" className="h-8 w-8">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        className={cn("border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0", className)}
        {...props}
      />
    </div>
  );
}