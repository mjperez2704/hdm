import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aviso de Privacidad</h1>
        <p className="text-muted-foreground">
          Gestiona el contenido del aviso de privacidad de la empresa.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Editor del Aviso de Privacidad</CardTitle>
          <CardDescription>
            Utiliza el siguiente editor para redactar y dar formato al aviso de privacidad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor 
            placeholder="Escribe aquí el aviso de privacidad..."
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
