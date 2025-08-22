import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import NewPasswordForm from "../../components/auth/NewPasswordForm";

export default function NewPassword() {
  return (
    <>
      <PageMeta
        title="Oneartpix.com | Şifrəni yenilə"
        description="Bu səhifə Oneartpix.com şifrə yeniləmə səhifəsidir."
      />
      <AuthLayout>
        <NewPasswordForm />
      </AuthLayout>
    </>
  );
}
