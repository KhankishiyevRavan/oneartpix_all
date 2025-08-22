import React from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface AddressProps {
  address: { [key: string]: any };
  setAddress: (field: string, value: string) => void;
  disabled?: boolean;
}

export default function AddressSection({
  address,
  setAddress,
  disabled,
}: AddressProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddress(name, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Street */}
      <div className="col-span-full">
        <Label htmlFor="street">Küçə</Label>
        <Input
          name="street"
          value={address?.street || ""}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      {/* City */}
      <div className="col-span-full">
        <Label htmlFor="city">Şəhər</Label>
        <Input
          name="city"
          value={address?.city || ""}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      {/* State */}
      {/* <div>
        <Label htmlFor="state">Ölkə</Label>
        <Input
          name="state"
          value={address?.state || ""}
          onChange={handleChange}
          disabled={disabled}
        />
      </div> */}

      {/* Post Code */}
      {/* <div>
        <Label htmlFor="postCode">Poçt kodu</Label>
        <Input
          name="postCode"
          value={address?.postCode || ""}
          onChange={handleChange}
          disabled={disabled}
        />
      </div> */}

      {/* Category */}
      {/* <div>
        <Label htmlFor="category">Milliyət</Label>
        <select
          name="category"
          value={address?.category || ""}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full h-11 rounded-md border border-gray-300 px-3 text-sm bg-transparent${
            disabled ? " cursor-not-allowed opacity-40 text-gray-500" : " cursor-pointer"
          } `}
        >
          {countries.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div> */}
    </div>
  );
}
