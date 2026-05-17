import { AuthShell } from "@/features/auth/components/AuthShell";
import { PasswordRecoveryForm } from "@/features/auth/components/PasswordRecoveryForm";

export default function ForgetPasswordPage() {
  return (
    <AuthShell
      description="Receba o código de redefinição e cadastre uma nova senha."
      title="Recupere o acesso com segurança"
    >
      <PasswordRecoveryForm />
    </AuthShell>
  );
}
