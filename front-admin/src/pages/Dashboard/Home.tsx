// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  // const role = localStorage.getItem("role");
  return (
    <>
      <PageMeta
        title="Oneartpix.com | Ecommerce Dashboard"
        description="This is Oneartpix.com Ecommerce Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* {role == "admin" && <EcommerceMetrics />}

          {role == "admin" && <MonthlySalesChart />} */}
        </div>

        <div className="col-span-12 xl:col-span-5">
          {/* {role == "admin" && <MonthlyTarget />} */}
        </div>

        {/* <div className="col-span-12">
          {role == "admin" && <StatisticsChart />}
        </div> */}

        <div className="col-span-12 xl:col-span-5">
          {/* <DemographicCard /> */}
        </div>

        <div className="col-span-12 xl:col-span-7">
          {/* <RecentOrders /> */}
        </div>
      </div>
    </>
  );
}
