import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      description="Entre para acessar sua visao geral, despesas, salario e configuracoes."
      title="Acesse seu painel financeiro."
    >
      <LoginForm />
    </AuthShell>
  );
}
