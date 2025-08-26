import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Políticas y Reglamentos</h1>
        <p className="text-muted-foreground">
          Define las políticas y reglamentos internos de la empresa.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Editor de Políticas</CardTitle>
          <CardDescription>
            Utiliza el siguiente editor para redactar y dar formato a las políticas de la empresa. El contenido se guardará y será visible para los empleados correspondientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <RichTextEditor 
                placeholder="Escribe aquí las políticas y reglamentos..."
                className="min-h-[400px]"
            />
        </CardContent>
        <CardFooter>
            <Button>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
