// StepTwo.tsx

import Label from "../../../components/form/Label";
type Role = {
  _id: string;
  name: string;
  showName: string;
  description: string;
  fields: any[];
  permissions: any[];
  __v: number;
};

interface ChooseRoleFormProps {
  formData: {
    roles: string[];
  };
 handleRoleChange: (role: string, checked: boolean) => void;
  roleList: Role[];
}

export default function ChooseRoleForm({
  formData,
  handleRoleChange,
  roleList,
}: ChooseRoleFormProps) {
  console.log(roleList);

  return (
    <div className="space-y-4">
      <Label className="input-label">
        {/* {errors.roles && <div className="error-message">{errors.roles}</div>} */}
        Select Roles
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roleList.map((role) => (
          <label key={role._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={role._id}
              checked={formData.roles.includes(role._id)}
              onChange={(e) => handleRoleChange(role._id, e.target.checked)}
              className="form-checkbox"
            />
            <span>{role.showName}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
