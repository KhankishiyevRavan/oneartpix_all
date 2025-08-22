import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Oneartpix.com | Sign Up"
        description="This is Oneartpix.com SignUp Tables Dashboard page"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
