import { useState } from "react";
import { Link } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
// import { sendResetEmail } from "../../services/authService";

export default function ResetPasswordForm() {
  // const navigate = useNavigate();
  const [errors, setErrors] = useState<{
    email?: string;
    message?: string;
    emptyFields?: string;
    authError?: string;
  }>({});
  const [formData, setFormData] = useState({
    email: "",
  });
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

  const { email } = formData;
  const emptyErrors: typeof errors = {};
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email.trim()) {
    emptyErrors.email = "E-poçt ünvanınızı daxil edin";
  } else if (!emailRegex.test(email)) {
    emptyErrors.email = "Düzgün email formatı yazın";
  }

  setErrors((prev) => ({
    ...prev,
    ...emptyErrors
  }));

  if (Object.keys(emptyErrors).length !== 0) return;

  try {
    // let data = await sendResetEmail(formData.email);
    // alert(data.message);
  } catch (err: any) {
    setErrors((prev) => ({ ...prev, message: err.message }));
    alert(err.message);
  }
};


  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Şifrəni unutmusunuz?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hesabınıza bağlı e-poçt ünvanınızı daxil edin və biz sizə şifrənin
              bərpası üçün keçid göndərəcəyik.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* <!-- E-poçt --> */}
                <div>
                  <Label className="input-label">
                    {errors.email && (
                      <div className="error-message">{errors.email}</div>
                    )}
                    E-poçt<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    className={
                      errors.email
                        ? "border-2 border-red-500 dark:border-red-500"
                        : "dark:bg-dark-900"
                    }
                    placeholder="E-poçt ünvanınızı daxil edin"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  >
                    Bərpa keçidini göndərin
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Gözləyin, şifrəmi xatırladım...
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Buraya klikləyin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
