import { useState, useEffect } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { useNavigate, useParams } from "react-router";
import {
  getAllRoles,
} from "../../services/roleService";
import { getUser, updateUser } from "../../services/userService";
import Select from "../../components/form/Select";
import Radio from "../../components/form/input/Radio";
import AddressSection from "../../components/form/AddressSection";
// Sahə tipini təyin edirik

export default function EditProfileForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    dynamicFields: {
      address: {
        street: "",
        city: "",
        state: "",
        postCode: "",
        category: "",
      },
    },
  });
  let role = localStorage.getItem("roleId");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Xətalar
  const { id } = useParams<{ id: string }>(); // Role params ilə alırıq
  const [roles, setRoles] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  // useEffect(() => {
  //   // const fetchRoleFields = async () => {
  //   //   console.log(role);

  //   //   if (!role) return; // Eğer role undefined veya boşsa, devam etmeyelim
  //   //   try {
  //   //     const data = await getRoleById(role); // Role məlumatlarını alırıq
  //   //     console.log(data);

  //   //     // Role ID və sahələri state-ə əlavə edirik
  //   //     setRoleId(data?._id || ""); // ID gəlməzsə boş dəyər təyin et
  //   //     setRoleFields(data?.fields || []); // Role sahələri təyin edirik
  //   //     // navigator("/")
  //   //   } catch (err: any) {
  //   //     console.error("Error fetching role data:", err); // Səhv baş verərsə konsola yazdırırıq
  //   //   }
  //   // };

  //   // fetchRoleFields();
  // }, [role]); // `
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles(); // Backend-dən bütün rolları alırıq
        console.log(data);
        setRoles(data); // Rolları state-ə saxlayırıq
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
    const fetchUser = async () => {
      if (!id) return;
      const data = await getUser(id);
      console.log(data);

      setFormData({
        ...data,
        ...data.dynamicFields,
      });
    };
    fetchUser();
  }, []);
  useEffect(() => {
    setOptions([]);
    roles?.map((d) => {
      console.log(d.name);
      setOptions((prev) => [...prev, { label: d.name, value: d._id }]);
    });
  }, [roles]);

  const generateIdentityNumber = () => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8 rəqəmli random number
    return `OP${randomNum}`;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: { [key: string]: string } = {};
    console.log(formData);

    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }
    try {
      if (!formData.permissions) {
        formData.permissions = {
          create: false,
          read: false,
          edit: false,
          delete: false,
        };
      }

      const userData = {
        // Statik sahələr
        identityNumber: "",
        fname: formData.fname,
        lname: formData.lname,
        fathername: formData.fathername,
        email: formData.email,
        // position: formData.position,
        status: formData.status,
        role: formData.role,
        address: formData.address,
      };
      userData.identityNumber = generateIdentityNumber();
      console.log(userData);
      if (!id) return;
      console.log(id);
      
      let data = await updateUser(id, userData);
      if (!role) return;
      alert(data.message);
      navigate(`/`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
    setFormData({ ...formData, role: value });
  };
  const handleRadioChange = (value: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      status: value,
    }));
    console.log("Selected:", value ? "Aktiv" : "Passiv");
  };
  const setAddress = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      dynamicFields: {
        ...prevData.dynamicFields,
        address: {
          ...prevData.dynamicFields?.address,
          [field]: value,
        },
      },
    }));
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };
  return (
    <ComponentCard title="Edit User Form">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label className="input-label">Rollar</Label>
            <Select
              options={options}
              placeholder="Select Option"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
              value={formData.role}
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
            <Label htmlFor="email" className="input-label">
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
              E-poçt
            </Label>
            <Input
              type="text"
              id="email"
              name="email"
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
          {/* <div>
            <Label htmlFor="position" className="input-label">
              {errors.position && (
                <div className="error-message">{errors.position}</div>
              )}
              Pozisiya
            </Label>
            <Input
              type="text"
              id="position"
              name="position"
              onChange={handleChange}
              value={formData.position}
              className={
                errors.position
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your operator position"
            />
          </div> */}
          <AddressSection address={formData?.address} setAddress={setAddress} />
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
        </div>
        <div className="flex gap-3 mt-6">
          <Button size="sm" type="submit">
            Update User
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
