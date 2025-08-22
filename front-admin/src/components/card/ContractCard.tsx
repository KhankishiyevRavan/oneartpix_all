import { useNavigate } from "react-router";
import { ContractInterface } from "../../services/contractService";
import Button from "../ui/button/Button";
import { useEffect, useState } from "react";
import { getUser, userDataInterface } from "../../services/userService";
import PaymentSchedule, {
  PaymentScheduleItem,
} from "../auth/contract/PaymentSchedule";
interface ContractMetaCardProps {
  contract: ContractInterface | null;
}
export default function ContractCard({ contract }: ContractMetaCardProps) {
  console.log(contract);

  const navigate = useNavigate();
  const redirectUser = () => {
    navigate(`/list/user/${contract?.subscriberId}`);
  };
  const [user, setUser] = useState<userDataInterface | null>(null);
  const fetchUser = async () => {
    if (!contract?.subscriberId) return;
    try {
      let data = await getUser(contract.subscriberId);
      console.log(data);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handlePayClick = (item: PaymentScheduleItem) => {
    // İstədiyin axın: yeni ödəniş səhifəsi, modal, və s.
    // /payments/new?contractId=${selectedContract._id}&month=${item.month}&userId=${user?._id}
    navigate(
      `/payments/new?contractId=${contract?._id}&month=${encodeURIComponent(
        item.month
      )}&userId=${user?._id}`
    );
  };
  useEffect(() => {
    fetchUser();
  }, [contract]);
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div style={{ width: "100%" }}>
          <div className="flex items-center justify-between content-center lg:mb-6 ">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 ">
              Müqavilə məlumatı
            </h4>
            <Button onClick={() => redirectUser()}>Abunəçi</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Müqavilə nömrəsi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.contractNumber}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Müştəri
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.fname} {user?.lname}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Müştəri nömrəsi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.phoneNumber}{" "}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Kombi Model
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.combiModel}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Başlama Tarixi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.startDate
                  ?.slice(0, 10)
                  .split("-")
                  .reverse()
                  .join("-")}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bitmə Tarixi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.endDate?.slice(0, 10).split("-").reverse().join("-")}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Paket
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.servicePackageName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Müqavilə Dəyəri
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.contractValue}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                İlkin Ödəniş
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.initialPayment}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Cari Ödəniş
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.totalPaidAmount}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ödəniş tipi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.subscriptionType == "monthly" ? "Aylıq" : "İllik"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Texniki baxış sayı
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.technicalInspection == 1
                  ? "İldə 1 dəfə"
                  : "İldə 2 dəfə"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {contract?.status}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ünvan
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.address}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between content-center lg:mb-6 ">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 ">
              Müqavilə ödəniş cədvəli
            </h4>
          </div>

          <PaymentSchedule
            schedule={contract?.paymentSchedule || []}
            onPayClick={handlePayClick}
            currency="₼"
          />
        </div>
      </div>
    </div>
  );
}
