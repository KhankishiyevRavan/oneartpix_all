import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon, InfoIcon } from "../../icons";
import { loginUser } from "../../services/authService";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { AuthContext } from "../../context/AuthContext";
import { getRoleByName } from "../../services/roleService";
import ReCAPTCHA from "react-google-recaptcha";
export default function SignInForm() {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    emptyFields?: string;
    authError?: string;
  }>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const resetErrors = () => {
  //   setErrors({});
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValidEmail = emailRegex.test(value);

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (value.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          email: "E-poçt ünvanınızı daxil edin",
        }));
      } else if (!isValidEmail) {
        setErrors((prev) => ({ ...prev, email: "Düzgün email formatı yazın" }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = formData;
    const emptyErrors: typeof errors = {};

    if (!email?.trim()) {
      emptyErrors.email = "E-poçt ünvanınızı daxil edin";
    }

    if (!password?.trim()) {
      emptyErrors.password = "Şifrənizi daxil edin";
    } else if (password.length < 8) {
      emptyErrors.password = "Şifrə ən azı 8 simvoldan ibarət olmalıdır";
    }

    // 👇 Burada resetErrors() yoxdur
    setErrors((prev) => ({
      ...prev,
      ...emptyErrors, // Yalnız yeni tapılan error-ları əlavə et
    }));

    if (Object.keys(emptyErrors).length !== 0) return;

    if (!captchaValue) {
      setErrors((prev) => ({
        ...prev,
        authError: "Robot olmadığınızı təsdiqləyin.",
      }));
      return;
    }

    try {
      const data = await loginUser({
        email,
        password,
      });

      if (data?.token) {
        let roleData = await getRoleByName(data.user.role);
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem(
          "permissions",
          JSON.stringify(roleData.permissions)
        );
        localStorage.setItem("balance", data.user.balance);
        setToken(data.token);
        if (isChecked) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.setItem("rememberMe", "false");
        }
        navigate("/");
      }
    } catch (err: any) {
      const authError = err.response?.data?.errors;
      setErrors((prev) => ({
        ...prev,
        ...authError,
      }));
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
    }
  };

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
          <Link
            to="/about"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <InfoIcon className="size-5 mr-2" />
            Haqqımızda
          </Link>
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Daxil olun
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daxil olmaq üçün e-poçt ünvanınızı və şifrənizi daxil edin.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label className="input-label">
                    {errors.email && (
                      <div className="error-message">
                        {errors.emptyFields ? errors.emptyFields : errors.email}
                      </div>
                    )}
                    E-poçt <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    className={
                      errors.email
                        ? "border-2 border-red-500 dark:border-red-500"
                        : ""
                    }
                    name="email"
                    placeholder="info@xengeland.az"
                    onChange={handleChange}
                    value={formData.email}
                    // type="email"
                  />
                </div>
                <div>
                  <Label className="input-label">
                    {errors.password && !errors.emptyFields && (
                      <div className="error-message">{errors.password}</div>
                    )}
                    Şifrə <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      className={
                        errors.password
                          ? "border-2 border-red-500 dark:border-red-500"
                          : ""
                      }
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifrənizi daxil edin"
                      onChange={handleChange}
                      value={formData.password}
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
                <div className="input-label">
                  {/* Burada authError mesajı */}
                  {errors.authError && (
                    <div
                      className="error-message text-red-500 mt-0"
                      style={{ top: "-20px" }}
                    >
                      {errors.authError}
                    </div>
                  )}
                  <ReCAPTCHA
                    sitekey="6LcucasrAAAAALBZZUuI9TdHE1A1jsWIlEt6H7CC"
                    onChange={onCaptchaChange}
                    ref={recaptchaRef}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setIsChecked(!isChecked)}
                  >
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <label className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400 cursor-pointer">
                      Məni yadda saxlayın
                    </label>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Şifrəni unutmusunuz?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Daxil olmaq
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
