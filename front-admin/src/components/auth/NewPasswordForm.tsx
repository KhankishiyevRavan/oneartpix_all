import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
// import { resetPasswordWithToken } from "../../services/authService";

export default function NewPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    confirmPassword?: string;
    password?: string;
    emptyFields?: string;
    authError?: string;
  }>({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emptyErrors: typeof errors = {};

    const { password, confirmPassword } = formData;

    const isPasswordEmpty = !password?.trim();
    const isConfirmPasswordEmpty = !confirmPassword?.trim();
    const isPasswordsMismatch = password !== confirmPassword;

    if (isPasswordEmpty) emptyErrors.password = "Şifrə tələb olunur";
    if (!isPasswordEmpty && !isConfirmPasswordEmpty && isPasswordsMismatch) {
      emptyErrors.confirmPassword = "Şifrələr uyğun gəlmir";
      emptyErrors.password = "Şifrələr uyğun gəlmir";
    }
    console.log(emptyErrors);

    setErrors(emptyErrors);

    if (Object.keys(emptyErrors).length !== 0) return;

    // let data = {
    //   password: formData.password,
    // };
    try {
      // let data = await resetPasswordWithToken(String(token), formData.password);
      // console.log(data);
      // alert(data.message);
      // navigate("/signin");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      {/* <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Şifrənizi yeniləyin
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hesabınız üçün yeni bir şifrə daxil edin.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* <!-- E-poçt --> */}
                {/* <div>
                  <Label>
                    {errors.email && (
                      <div className="error-message">{errors.lname}</div>
                    )}
                    E-poçt<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div> */}
                {/* <!-- Password --> */}
                <div>
                  <Label className="input-label">
                    {errors.password && (
                      <div className="error-message">{errors.password}</div>
                    )}
                    Şifrə<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Şifrənizi daxil edin"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="input-label">
                    {errors.confirmPassword && (
                      <div className="error-message">
                        {errors.confirmPassword}
                      </div>
                    )}
                    Şifrəni təsdiqlə<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Şifrənizi yenidən daxil edin"
                      type={showPasswordConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPasswordConfirm ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                {/* <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setIsChecked(!isChecked)}
                >
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <label className="inline-block font-normal text-gray-500 dark:text-gray-400 cursor-pointer">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </label>
                </div> */}
                {/* <!-- Button --> */}
                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  >
                    Şifrəni yadda saxla
                  </button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
