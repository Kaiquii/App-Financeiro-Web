import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      description="Crie sua conta e depois entre pelo fluxo padrao do projeto."
      title="Comece com uma conta segura."
    >
      <RegisterForm />
    </AuthShell>
  );
}
