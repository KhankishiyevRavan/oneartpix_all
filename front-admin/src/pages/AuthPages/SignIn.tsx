import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Oneartpix.com | Daxil olma"
        description="Bu Oneartpix.com-ın daxil olma formudur."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
