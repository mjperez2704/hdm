import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function ManualsPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Manuales</h1>
            <p className="text-muted-foreground">
            Sube y administra los manuales técnicos, guías de usuario y otros documentos importantes.
            </p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Cargar Nuevo Manual</CardTitle>
          <CardDescription>
            Selecciona un archivo (PDF, DOCX, TXT) para subir al sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para cargar</span> o arrastra y suelta</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCS, TXT</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" disabled />
                </label>
            </div> 
        </CardContent>
        <CardFooter>
            <Button disabled>Subir Manual</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
