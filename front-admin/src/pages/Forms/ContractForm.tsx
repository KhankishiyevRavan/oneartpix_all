// ContractForm.jsx
import { useState, useEffect } from "react";
import DatePicker from "../../components/form/date-picker";
import Select from "../../components/form/Select";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { getUser } from "../../services/userService";
import { useNavigate, useParams } from "react-router";
import AddressSection from "../../components/form/AddressSection";
import Radio from "../../components/form/input/Radio";
import {
  getAllServicePackages,
  ServicePackageInterface,
} from "../../services/servicePackageService";
import { addYears } from "date-fns";
import { createContract } from "../../services/contractService";

type ErrorsType = Partial<{
  combiModel: string;
  contractDuration: string;
  contractValue: string;
  endDate: string;
  initialPayment: string;
  servicePackage: string;
  servicePackageName: string;
  technicalInspection: string;
  startDate: string;
  status: string;
  subscriberId: string;
  subscriptionType: string;
  // terms: string;
}>;
export default function ContractForm() {
  const navigate = useNavigate();
  const { subsId } = useParams();
  const [servicePackages, setServicePackages] = useState<
    ServicePackageInterface[]
  >([]);

  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const optionsDate = [
    { value: "1", label: "1 il" },
    { value: "2", label: "2 il" },
    { value: "3", label: "3 il" },
  ];
  const optionsSubscriptionType = [
    { value: "monthly", label: "aylıq" },
    { value: "annually", label: "illik" },
  ];
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    servicePackage: "",
    servicePackageName: "",
    technicalInspection: "1",
    contractDuration: "",
    subscriptionType: "",
    // terms: "",
    combiModel: "",
    contractValue: "",
    initialPayment: "",
    status: "Gözləmədə",
    subscriberId: "",
  });
  const [errors, setErrors] = useState<ErrorsType>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subscriber, setSubscriber] = useState<{ [key: string]: any }>({
    address: {
      street: "",
      city: "",
      state: "",
      postCode: "",
      category: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!subsId) return;
      try {
        let data = await getUser(subsId);
        setSubscriber(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
    const fetchPackages = async () => {
      try {
        let data = await getAllServicePackages();
        if (data) {
          const newOptions = data.map((d) => ({
            value: String(d._id),
            label: d.name,
          }));
          setOptions(() => [...newOptions]);
          setServicePackages(data);
        }
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log(formData);
    const emptyErrors: ErrorsType = {};

    const {
      startDate,
      endDate,
      servicePackage,
      contractDuration,
      // terms,
      combiModel,
      contractValue,
      initialPayment,
    } = formData;
    const isStartDateEmpty = !startDate?.trim();
    const isEndDateEmpty = !endDate?.trim();
    const isServicePackageEmpty = !servicePackage?.trim();
    const isServicePackageDateEmpty = !contractDuration?.trim();
    const isCombiModelEmpty = !combiModel?.trim();
    const isContractValueEmpty = !contractValue?.trim();
    const isInitialPaymentEmpty = !initialPayment?.trim();
    // const isTermsEmpty = !terms?.trim();
    if (isStartDateEmpty)
      emptyErrors.startDate = "Başlama tarixi qeyd olunmalıdır";
    if (isEndDateEmpty) emptyErrors.endDate = "Bitmə tarixi qeyd olunmalıdır";
    if (isServicePackageEmpty)
      emptyErrors.servicePackage = "Xidmət paketi seçilməlidir";
    if (isServicePackageDateEmpty)
      emptyErrors.contractDuration = "Müddət qeyd olunmalıdır";
    if (isServicePackageDateEmpty)
      emptyErrors.subscriptionType = "Abunə növü seçilməlidir";
    if (isCombiModelEmpty)
      emptyErrors.combiModel = "Kombi modeli qeyd olunmalıdır";
    if (isContractValueEmpty)
      emptyErrors.contractValue = "Müqavilə dəyəri qeyd olunmalıdır";
    if (isInitialPaymentEmpty)
      emptyErrors.initialPayment = "İlkin ödəniş qeyd olunmalıdır";
    // if (isTermsEmpty) emptyErrors.terms = "Şərtlər qeyd olunmalıdır";

    setErrors(emptyErrors);
    console.log(emptyErrors);
    if (Object.keys(emptyErrors).length !== 0) return;
    if (!subsId) return;
    console.log({
      ...formData,
      subscriberId: subsId,
    });
    const startDateData = formData.startDate
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("-");
    const endDateData = formData.endDate
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("-");
    try {
      let data = await createContract({
        ...formData,
        startDate: startDateData,
        endDate: endDateData,
        subscriberId: subsId,
      });
      console.log(data);

      alert(data.message);
      navigate(`/list/user/${subsId}`);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleSelectChange = (value: string) => {
    let servicePackageName = servicePackages.find((o) => o._id == value);
    console.log(servicePackageName);
    if (!servicePackageName?.technicalInspection) return;
    setFormData({
      ...formData,
      servicePackage: value,
      servicePackageName: String(servicePackageName?.name),
      technicalInspection: servicePackageName.technicalInspection,
    });
  };
  const handleSelectChangeSubscriptionType = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      subscriptionType: value,
    }));
  };
  const handleSelectChangePackageDate = (value: string) => {
    const durationInYears = parseInt(value);
    if (!formData.startDate) {
      setFormData((prevData) => ({
        ...prevData,
        contractDuration: value,
        contractValue: "0",
        endDate: "",
      }));
      return;
    }

    const parseDateFromDDMMYYYY = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split("-");
      return new Date(`${year}-${month}-${day}`);
    };

    const formatDateToDDMMYYYY = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const startDate = parseDateFromDDMMYYYY(formData.startDate);
    const calculatedEndDate = addYears(startDate, durationInYears);

    setFormData((prevData) => ({
      ...prevData,
      contractDuration: value,
      endDate: formatDateToDDMMYYYY(calculatedEndDate),
    }));
  };

  useEffect(() => {
    console.log(subscriber);
  }, [subscriber]);
  const setAddress = () => {};
  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    console.log(name);

    if (type === "checkbox" || type === "radio") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    if (
      !formData.servicePackage ||
      !formData.contractDuration ||
      !formData.subscriptionType
    )
      return;
    console.log(formData);

    const selectedPackage = servicePackages.find(
      (pkg) => pkg._id === formData.servicePackage
    );
    console.log(selectedPackage);

    if (!selectedPackage) return;

    const basePrice = Number(selectedPackage.totalPrice) || 0;
    console.log(basePrice);

    const years = parseInt(formData.contractDuration);
    let total = 0;

    if (formData.subscriptionType === "monthly") {
      total = basePrice * 12 * years;
    } else if (formData.subscriptionType === "annually") {
      total = basePrice * 11 * years; // 1 ay endirim
    }

    setFormData((prev) => ({
      ...prev,
      contractValue: total.toString(),
    }));
  }, [
    formData.servicePackage,
    formData.contractDuration,
    formData.subscriptionType,
    servicePackages,
  ]);

  return (
    <div>
      <h2>Müqavilə Yarat (Abunəçi: {subscriber?.fname})</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label className="input-label">Rollar</Label>
          <Input
            type="text"
            id="role"
            name="role"
            value={subscriber.roleName}
            disabled={true}
          />
        </div>
        {/* First Name */}
        <div>
          <Label htmlFor="fname" className="input-label">
            Adı
          </Label>
          <Input
            type="text"
            id="fname"
            name="fname"
            value={subscriber.fname}
            disabled={true}
          />
        </div>
        <div>
          <Label htmlFor="lname" className="input-label">
            Soyadı
          </Label>
          <Input
            type="text"
            name="lname"
            value={subscriber.lname}
            id="lname"
            disabled={true}
          />
        </div>
        <div>
          <Label htmlFor="fathername" className="input-label">
            Ata adı
          </Label>
          <Input
            type="text"
            name="fathername"
            value={subscriber?.fathername}
            id="fathername"
            disabled={true}
          />
        </div>
        <div>
          <Label htmlFor="email" className="input-label">
            E-poçt
          </Label>
          <Input
            type="text"
            id="email"
            name="email"
            value={subscriber.email}
            disabled={true}
          />
        </div>
        <AddressSection
          address={subscriber?.address}
          setAddress={setAddress}
          disabled={true}
        />
        <div>
          <Label htmlFor="status" className="input-label">
            Status
          </Label>
          <div className="flex flex-wrap items-center gap-4">
            <Radio
              id="Aktiv"
              name="status"
              value="true"
              label="Aktiv"
              disabled
              checked={subscriber.status === true}
              onChange={() => {
                console.log("");
              }}
            />
            <Radio
              id="Passiv"
              name="status"
              value="false"
              label="Passiv"
              disabled
              checked={subscriber.status === false}
              onChange={() => {
                console.log("");
              }}
            />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div>
            <DatePicker
              id="start-date-picker"
              label="Başlama Tarixi:"
              placeholder="Select a date"
              value={formData.startDate}
              error={errors.startDate}
              onChange={(_dates, currentDateString) => {
                const parseDateFromDDMMYYYY = (dateStr: string): Date => {
                  const [day, month, year] = dateStr.split("-");
                  return new Date(`${year}-${month}-${day}`);
                };

                const formatDateToDDMMYYYY = (date: Date) => {
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();
                  return `${day}-${month}-${year}`;
                };

                let newEndDate = "";
                const duration = parseInt(formData.contractDuration);

                if (duration && currentDateString) {
                  const start = parseDateFromDDMMYYYY(currentDateString);
                  const calculatedEndDate = addYears(start, duration);
                  newEndDate = formatDateToDDMMYYYY(calculatedEndDate);
                }

                setFormData({
                  ...formData,
                  startDate: currentDateString,
                  endDate: newEndDate,
                });
              }}
            />
          </div>
          <div>
            <DatePicker
              id="end-date-picker"
              label="Bitiş Tarixi:"
              placeholder="Select a date"
              value={formData.endDate || ""}
              error={errors.endDate}
              minDate={formData.startDate}
              disabled={true}
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.servicePackage && (
                <div className="error-message">{errors.servicePackage}</div>
              )}
              Paket
            </Label>
            <Select
              options={options}
              placeholder="Select an option"
              onChange={handleSelectChange}
              className={
                errors.servicePackage
                  ? "border-2 border-red-500 dark:border-red-500"
                  : "dark:bg-dark-900"
              }
              value={formData.servicePackage}
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.contractDuration && (
                <div className="error-message">{errors.contractDuration}</div>
              )}
              Müqavilə müddəti
            </Label>
            <Select
              options={optionsDate}
              placeholder="Select an option"
              onChange={handleSelectChangePackageDate}
              className={
                errors.contractDuration
                  ? "border-2 border-red-500 dark:border-red-500"
                  : "dark:bg-dark-900"
              }
              value={formData.contractDuration}
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.combiModel && (
                <div className="error-message">{errors.combiModel}</div>
              )}
              Kombi model
            </Label>
            <Input
              type="text"
              className={
                errors.combiModel
                  ? "border-2 border-red-500 dark:border-red-500"
                  : "dark:bg-dark-900"
              }
              name="combiModel"
              onChange={handleFieldChange}
              value={formData.combiModel}
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.subscriptionType && (
                <div className="error-message">{errors.subscriptionType}</div>
              )}
              Ödəniş tipi
            </Label>
            <Select
              options={optionsSubscriptionType}
              placeholder="Select an option"
              onChange={handleSelectChangeSubscriptionType}
              className={
                errors.subscriptionType
                  ? "border-2 border-red-500 dark:border-red-500"
                  : "dark:bg-dark-900"
              }
              value={formData.subscriptionType}
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.contractValue && (
                <div className="error-message">{errors.contractValue}</div>
              )}
              Müqavilə Dəyəri
            </Label>
            <Input
              name="contractValue"
              type="number"
              value={formData.contractValue}
              disabled
              className="dark:bg-dark-900"
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.initialPayment && (
                <div className="error-message">{errors.initialPayment}</div>
              )}{" "}
              İlkin Ödəniş
            </Label>
            <Input
              type="number"
              name="initialPayment"
              className={
                errors.initialPayment
                  ? "border-2 border-red-500 dark:border-red-500"
                  : "dark:bg-dark-900"
              }
              onChange={handleFieldChange}
              value={formData.initialPayment}
            />
          </div>
          <div>
            <Label>Status</Label>

            <select
              name="status"
              onChange={handleFieldChange}
              value={formData.status}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800  dark:bg-dark-900 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Gözləmədə">Gözləmədə</option>
              <option value="Aktiv">Aktiv</option>
            </select>
          </div>
        </div>
        <div className="block gap-3 mt-3  ">
          <Button size="sm" type="submit">
            Müqavilə yadda saxla
          </Button>
        </div>
      </form>
    </div>
  );
}
