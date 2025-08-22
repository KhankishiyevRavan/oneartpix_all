import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ChooseContractUser from "../ChooseContractUser";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";

export default function ChooseAddBalanceTables() {
  return (
    <>
      <PageMeta
        title="Oneartpix.com | Satış üçün istifadəçi seçmə"
        description="This is Oneartpix.com Kontrak List Tables Dashboard page"
      />
      <PageBreadcrumbSub
        modelName="Ödəniş xidmətləri"
        pageTitle={`Ödənişlər`}
        subTitle="Balans əlavə et"
        pageTitleSrc="/sales"
      />
      <div className="space-y-6">
        <ComponentCard
          title={`Balans əlavə edəcəyiniz istifadəçini siyahıdan seçin`}
        >
          <ChooseContractUser navigateBasePath="/add-balance" />
        </ComponentCard>
      </div>
    </>
  );
}
