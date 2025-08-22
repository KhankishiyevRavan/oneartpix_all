import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ChooseContractUser from "../ChooseContractUser";

export default function ChooseContractTables() {
  return (
    <>
      <PageMeta
        title="Oneartpix.com | User List Tables"
        description="This is Oneartpix.com Kontrak List Tables Dashboard page"
      />
      <PageBreadcrumb pageTitle={`Müqavilə əlavə et`} modelName="Müqavilələr"/>
      <div className="space-y-6">
        <ComponentCard
          title={`Kontrakt əlavə edəcəyiniz istifadəçini siyahıdan seçin`}
        >
          <ChooseContractUser navigateBasePath="/create-contract" />
        </ComponentCard>
      </div>
    </>
  );
}
