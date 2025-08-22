import { useParams } from "react-router";
import { useEffect, useState } from "react";
import PageMeta from "../components/common/PageMeta";
import {
  ContractInterface,
  getContractById,
} from "../services/contractService";
import ContractCard from "../components/card/ContractCard";
import RepairServiceCard from "../components/card/RepairServiceCard";
import { getRepairsByContract } from "../services/repairService";
import PageBreadcrumbSub from "../components/common/PageBreadCrumbSub";

interface RepairService {
  serviceDate: string;
  serviceType: string;
  description: string;
  result: string;
  [x: string]: any;
  repairDate: string;
  repairPrice:string;
  repairTime: string;
  status: string;
  technician: {
    fname: string;
    lname: string;
    _id: string;
  };
}

export default function Contract() {
  const { id } = useParams();
  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [repairs, setRepairs] = useState<RepairService[]>([]);

  const fetchContract = async () => {
    if (!id) return;
    try {
      const data = await getContractById(id);
      setContract(data);
    } catch (err) {
      console.error("Müqavilə alınarkən xəta:", err);
    }
  };

  const fetchRepairs = async () => {
    if (!id) return;
    try {
      const data = await getRepairsByContract(id); // contract._id yerinə `id` istifadə et
      console.log(data);

      setRepairs(data);
    } catch (err) {
      console.error("Təmir məlumatı alınarkən xəta:", err);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  useEffect(() => {
    if (contract?._id) {
      fetchRepairs();
    }
  }, [contract?._id]);

  return (
    <>
      <PageMeta
        title="Oneartpix.com | Profile Dashboard"
        description="This is Oneartpix.com Profile Dashboard page"
      />
      <PageBreadcrumbSub
        subTitle={`Müqavilə ${contract?.contractNumber}`}
        pageTitle={`Müqavilə siyahısı`}
        pageTitleSrc="/contracts"
        modelName="Müqavilələr"
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <ContractCard contract={contract} />
        </div>
        <div className="space-y-6">
          <RepairServiceCard repairs={repairs || []} />
        </div>
      </div>
    </>
  );
}
