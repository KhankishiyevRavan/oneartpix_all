import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  minDate?: DateOption;
  maxDate?: DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  value?: string; // yeni value prop
  disabled?: boolean;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  minDate: minDate,
  maxDate: maxDate,
  placeholder,
  className,
  error,
  value,
  disabled,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      // dateFormat: "Y-m-d",
      dateFormat: "d-m-Y",
      defaultDate: value || defaultDate,
      minDate: minDate, 
      maxDate: maxDate, 
      onChange,
      disableMobile: true, // İstəyə bağlı olaraq (mobildə native date-picker çıxmasın deyə)
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, value, minDate, maxDate, disabled]);

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="input-label">
          {error && <div className="error-message">{error}</div>}
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          // min={'08/07/2007'}
          className={`${
            disabled
              ? " cursor-not-allowed opacity-40 text-gray-500"
              : " cursor-pointer"
          } ${
            error
              ? "border-2 border-red-500 dark:border-red-500"
              : "dark:bg-gray-900"
          }  ${className} h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800`}
        />

        <span
          className={`absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400 ${
            disabled
              ? " cursor-not-allowed opacity-40 text-gray-500"
              : " cursor-pointer"
          }`}
        >
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
