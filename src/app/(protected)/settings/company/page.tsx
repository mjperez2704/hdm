import { CompanyProfileForm } from "@/components/company-profile-form";

export default function CompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Datos de la Empresa</h1>
        <p className="text-muted-foreground">
          Administra la información fiscal y de contacto de tu empresa.
        </p>
      </div>
      <CompanyProfileForm />
    </div>
  );
}
