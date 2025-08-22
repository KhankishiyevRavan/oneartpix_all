import { useEffect, useState } from "react";
import {
  ContractInterface,
  getContractsBySubscriberId,
} from "../../services/contractService";
import ContractsSection from "../../pages/ContractSection";
interface UserMetaCardProps {
  id: string | null;
}
export default function UserContractCard({ id }: UserMetaCardProps) {
  const [contracts, setContracts] = useState<ContractInterface[]>([]);

  const fetchContracts = async () => {
    try {
      if (!id) return;
      let data = await getContractsBySubscriberId(id);
      setContracts(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log("test");

    fetchContracts();
  }, []);
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div style={{ width: "100%" }}>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Müqavilələr
          </h4>
          <ContractsSection
            contracts={contracts}
            id={id}
          />
        </div>
      </div>
    </div>
  );
}
