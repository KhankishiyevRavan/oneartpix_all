import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router";
import { createUser } from "../../services/userService";
import { getAllRoles } from "../../services/roleService";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Radio from "../../components/form/input/Radio";
import { EyeCloseIcon, EyeIcon, InfoIcon } from "../../icons";
// import AddressSection from "../../components/form/AddressSection";
import DatePicker from "../../components/form/date-picker";
import PhoneInputAz from "../../components/form/group-input/PhoneInputAz";

export default function CreateUserDataForm() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles(); // Backend-dən bütün rolları alırıq
        console.log(data);
        setRoles(data); // Rolları state-ə saxlayırıq
      } catch (err: any) {
        console.log(err.response);
        alert(err?.response?.data?.message);
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    fathername: "",
    email: "",
    password: "",
    status: true,
    role: "",
    identityNumber: "AZ12345678",
    phoneNumber: "",
    address: "",
    bDate: "",
  });
  // Form məlumatları
  const [errors, setErrors] = useState<{
    fname?: string;
    lname?: string;
    fathername?: string;
    email?: string;
    password?: string | string[];
    phoneNumber?: string;
    address?: string;
    bDate?: string;
    emptyFields?: string;
    authError?: string;
    role?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(errors);

    const emptyErrors: typeof errors = {};
    const {
      fname,
      lname,
      fathername,
      email,
      phoneNumber,
      address,
      password,
      role,
      bDate,
    } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(role);

    if (!email?.trim()) {
      emptyErrors.email = "Elektron poçt qeyd edilməlidir";
    } else if (!emailRegex.test(email)) {
      emptyErrors.email = "Elektron poçt düzgün formatda deyil";
    }
    if (!fname?.trim()) emptyErrors.fname = "İstifadəçi adı qeyd edilməlidir";
    if (!role?.trim()) emptyErrors.role = "Rol seçilməlidir";
    if (!bDate?.trim()) emptyErrors.bDate = "Doğum tarixi qeyd edilməlidir";
    if (!lname?.trim())
      emptyErrors.lname = "İstifadəçi Soyadı qeyd edilməlidir";
    if (!fathername?.trim())
      emptyErrors.fathername = "İstifadəçi Ata adı qeyd edilməlidir";
    if (!phoneNumber?.slice(4).trim())
      emptyErrors.phoneNumber = "Mobil nömrə qeyd edilməlidir.";
    if (
      phoneNumber?.slice(4)?.trim()?.length < 9 &&
      phoneNumber?.slice(4)?.trim()?.length > 0
    )
      emptyErrors.phoneNumber = "Mobil nömrə düzgün qeyd edilməlidir.";
    if (!address?.trim()) emptyErrors.address = "Ünvan qeyd edilməlidir.";

    // 🔴 Password validation burada da edilməlidir:
    const passwordErrors: string[] = [];
    if (!password.trim()) {
      passwordErrors.push("Şifrə təyin edilməlidir.");
    }
    if (password.length < 8) {
      passwordErrors.push("Şifrə ən azı 8 simvoldan ibarət olmalıdır.");
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("Şifrə ən azı bir böyük hərf olmalıdır.");
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("Şifrə ən azı bir kiçik hərf olmalıdır.");
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push("Şifrə ən azı bir rəqəm olmalıdır.");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      passwordErrors.push("Şifrə ən azı bir xüsusi simvol olmalıdır.");
    }

    if (passwordErrors.length > 0) {
      emptyErrors.password = passwordErrors;
    }

    // 🔔 Errors-ları state-də saxla və submiti dayandır:
    setErrors((prev) => ({
      ...prev,
      ...emptyErrors,
    }));

    if (Object.keys(emptyErrors).length !== 0) {
      return;
    }

    const generateIdentityNumber = () => {
      const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8 rəqəmli random number
      return `OP${randomNum}`;
    };

    try {
      const userData = {
        identityNumber: generateIdentityNumber(),
        fname: formData.fname,
        lname: formData.lname,
        fathername: formData.fathername,
        email: formData.email,
        password: formData.password,
        status: formData.status,
        bDate: formData.bDate,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };
      console.log(userData);

      let data = await createUser(userData);
      console.log(data);

      let roleName = options.find((r) => r.value == userData.role);
      console.log(roleName);

      if (roleName.label == "abuneci") {
        navigate(`/create-contract/${data.user._id}`);
      } else {
        navigate(`/`);
      }
      alert(data.message);
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {});
      err.response?.data?.message && alert(err.response?.data?.message);
      console.error(err);
    }
  };
  const handleRadioChange = (value: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      status: value,
    }));
    console.log("Selected:", value ? "Aktiv" : "Passiv");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      const passwordErrors: string[] = [];

      if (!value.trim()) {
        passwordErrors.push("Şifrə təyin edilməlidir.");
      }
      if (value.length < 8) {
        passwordErrors.push("Şifrə ən azı 8 simvoldan ibarət olmalıdır.");
      }
      if (!/[A-Z]/.test(value)) {
        passwordErrors.push("Şifrə ən azı bir böyük hərf olmalıdır.");
      }
      if (!/[a-z]/.test(value)) {
        passwordErrors.push("Şifrə ən azı bir kiçik hərf olmalıdır.");
      }
      if (!/[0-9]/.test(value)) {
        passwordErrors.push("Şifrə ən azı bir rəqəm olmalıdır.");
      }
      if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
        passwordErrors.push("Şifrə ən azı bir xüsusi simvol olmalıdır.");
      }

      setErrors((prev) => ({
        ...prev,
        password: passwordErrors.length > 0 ? passwordErrors : undefined,
      }));
    } else {
      // Digər sahələr üçün sadəcə error-u sil
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  useEffect(() => {
    setOptions([]);
    roles?.map((d) => {
      console.log(d.name);
      setOptions((prev) => [...prev, { label: d.name, value: d._id }]);
    });
  }, [roles]);
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
    setFormData({ ...formData, role: value });
  };
  const handlePhoneNumberChange = (phoneNumber: string) => {
    // Əgər 10 simvoldan artıqdırsa, əlavə daxil etməyə icazə vermirik
    console.log(phoneNumber.length);

    setFormData({ ...formData, phoneNumber: phoneNumber });
    console.log("Updated phone number:", phoneNumber);

    setErrors((prev) => ({
      ...prev,
      phoneNumber: undefined,
    }));

    if (!phoneNumber?.slice(4).trim()) {
      setErrors({ ...errors, phoneNumber: "Mobil nömrə qeyd edilməlidir" });
    }
    console.log(phoneNumber?.slice(4)?.trim()?.length);

    if (
      phoneNumber?.slice(4)?.trim()?.length !== 9 &&
      phoneNumber?.slice(4)?.trim()?.length > 0
    ) {
      setErrors({
        ...errors,
        phoneNumber: "Mobil nömrə düzgün qeyd edilməlidir",
      });
    }
  };
  const countries = [
    { code: "AZ", label: "+994" },
    { code: "TR", label: "+90" },
    { code: "RU", label: "+7" },
    { code: "GE", label: "+995" },
  ];
  const handleBirthDayChange = (dates: Date[], currentDateString: string) => {
    console.log({ dates, currentDateString });
    setFormData({ ...formData, bDate: currentDateString });
    setErrors({ ...errors, bDate: "" });
  };
  return (
    <ComponentCard title="İstifadəçi Yaratma Formu ">
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label className="input-label">
              {errors.role && (
                <div className="error-message">{errors.role}</div>
              )}
              Rollar
            </Label>
            <Select
              options={options}
              placeholder="Select Option"
              onChange={handleSelectChange}
              className={
                errors.role
                  ? "border-2 border-red-500 dark:border-red-500"
                  : "dark:bg-dark-900"
              }
            />
          </div>
          <div>
            <Label htmlFor="fname" className="input-label">
              {errors.fname && (
                <div className="error-message">{errors.fname}</div>
              )}
              Adı
            </Label>
            <Input
              type="text"
              id="fname"
              name="fname"
              onChange={handleChange}
              value={formData.fname}
              className={
                errors.fname
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <Label htmlFor="lname" className="input-label">
              {errors.lname && (
                <div className="error-message">{errors.lname}</div>
              )}
              Soyadı
            </Label>
            <Input
              type="text"
              name="lname"
              onChange={handleChange}
              value={formData.lname}
              id="lname"
              className={
                errors.lname
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <Label htmlFor="fathername" className="input-label">
              {errors.fathername && (
                <div className="error-message">{errors.fathername}</div>
              )}
              Ata adı
            </Label>
            <Input
              type="text"
              name="fathername"
              onChange={handleChange}
              value={formData.fathername}
              id="fathername"
              className={
                errors.fathername
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your father name"
            />
          </div>
          <div>
            <DatePicker
              // className={
              //   errors.bDate
              //     ? "border-2 border-red-500 dark:border-red-500"
              //     : ""
              // }
              id="date-picker"
              label="Doğum günü"
              placeholder="Select a date"
              error={errors.bDate}
              onChange={(dates, currentDateString) =>
                handleBirthDayChange(dates, currentDateString)
              }
            />
          </div>
          <div>
            <Label htmlFor="address" className="input-label">
              {errors.address && (
                <div className="error-message">{errors.address}</div>
              )}
              Ünvan
            </Label>
            <Input
              type="text"
              id="address"
              name="address"
              onChange={handleChange}
              value={formData.address}
              className={
                errors.address
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your operator address"
            />
          </div>
          <div>
            <Label htmlFor="email" className="input-label">
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
              E-poçt
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              onChange={handleChange}
              value={formData.email}
              className={
                errors.email
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your operator email"
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.phoneNumber && (
                <div className="error-message">{errors.phoneNumber}</div>
              )}
              Telefon nömrəsi
            </Label>
            <PhoneInputAz
              selectPosition="end"
              countries={countries}
              placeholder="+994 (55) 000-00-00"
              onChange={handlePhoneNumberChange}
              className={
                errors.phoneNumber
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
            />
          </div>
          <div>
            <Label htmlFor="status" className="input-label">
              {/* {errors.status && (
                <div className="error-message">{errors.status}</div>
              )} */}
              Status
            </Label>
            <div className="flex flex-wrap items-center gap-4">
              <Radio
                id="Aktiv"
                name="status"
                value="true"
                label="Aktiv"
                checked={formData.status === true}
                onChange={() => handleRadioChange(true)}
              />
              <Radio
                id="Passiv"
                name="status"
                value="false"
                label="Passiv"
                checked={formData.status === false}
                onChange={() => handleRadioChange(false)}
              />
            </div>
          </div>

          {/* <AddressSection address={formData?.address} setAddress={setAddress} /> */}
          <div>
            <Label className="input-label">Şifrə</Label>
            <div className="relative">
              <Input
                placeholder="Şifrənizi daxil edin"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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
            {Array.isArray(errors.password) && (
              <div className="mt-2 rounded-md bg-red-100 p-2 text-sm text-red-700">
                {errors.password.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <InfoIcon className="size-4 shrink-0 fill-red-500" />
                    {msg}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Button className="mt-8" size="sm" type="submit">
          İstifadəçi yarat
        </Button>
      </form>
    </ComponentCard>
  );
}
