import { AuthShell } from "@/features/auth/components/AuthShell";
import { PasswordRecoveryForm } from "@/features/auth/components/PasswordRecoveryForm";

export default function ForgetPasswordPage() {
  return (
    <AuthShell
      description="Receba o codigo de redefinicao e cadastre uma nova senha."
      title="Recupere o acesso com seguranca."
    >
      <PasswordRecoveryForm />
    </AuthShell>
  );
}
