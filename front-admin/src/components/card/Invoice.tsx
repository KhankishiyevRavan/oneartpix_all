import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useParams } from "react-router";
import { getPaymentById, PaymentDetails } from "../../services/paymentService";
import { format } from "date-fns";
import { az } from "date-fns/locale";

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "dd MMMM yyyy, HH:mm", { locale: az });
}
const Invoice: React.FC = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<PaymentDetails | null>(null);

  const fetchInvoice = async () => {
    if (!id) return;
    try {
      let data = await getPaymentById(id);
      console.log(data);
      setInvoice(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchInvoice();
  }, []);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">
          Qaimə
        </h3>
        <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">
          ID : {invoice?.paymentId}
        </h4>
      </div>
      <div className="p-5 xl:p-8">
        <div className="flex flex-col gap-6 mb-9 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
              Kimdən
            </span>
            <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
              {invoice?.receivedBy.fname == "admin"
                ? "admin"
                : `${invoice?.receivedBy.fname} ${invoice?.receivedBy.lname}`}
            </h5>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {invoice?.method == "cash" ? "Nəğd" : "Online"}
            </p>
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Nə zaman:
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {invoice?.createdAt && formatDateTime(invoice?.createdAt)}
            </span>
          </div>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-800 sm:h-[158px] sm:w-px"></div>
          <div className="sm:text-right">
            <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
              Kimə üçün
            </span>
            <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
              {invoice?.subscriber?.fname} {invoice?.subscriber.lname}
            </h5>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {invoice?.contractNumber}
            </p>
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Ödəniş təsviri: :
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {invoice?.type == "monthly"
                ? `${invoice.months[0]} Aylıq ödəniş`
                : invoice?.type == "annual"
                ? "Illik ödəniş"
                : "Balans artımı"}
            </span>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] ">
                <TableRow>
                  <TableCell className=" px-5 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-400">
                    #
                  </TableCell>
                  <TableCell className=" px-5 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-400">
                    Xidmət
                  </TableCell>
                  <TableCell className=" px-5 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-400">
                    Say
                  </TableCell>
                  <TableCell className=" px-5 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-400">
                    Qiymət
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                <TableRow>
                  <TableCell className="px-5 py-3.5 text-left text-gray-500 text-theme-sm dark:text-gray-400">
                    1
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-left text-gray-500 text-theme-sm dark:text-gray-400">
                    {invoice?.subscriber?.packageName}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-left text-gray-500 text-theme-sm dark:text-gray-400">
                    1
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-left text-gray-500 text-theme-sm dark:text-gray-400">
                    {invoice?.amount} ₼
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="pb-6 my-6 text-right border-b border-gray-100 dark:border-gray-800">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            Ümumi hesab:  {invoice?.amount} ₼
          </p>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Endirim (0%): 0 ₼
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Cəmi :  {invoice?.amount} ₼
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          {/* <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Proceed to payment
          </button> */}
          <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99578 4.08398C6.58156 4.08398 6.24578 4.41977 6.24578 4.83398V6.36733H13.7542V5.62451C13.7542 5.42154 13.672 5.22724 13.5262 5.08598L12.7107 4.29545C12.5707 4.15983 12.3835 4.08398 12.1887 4.08398H6.99578ZM15.2542 6.36902V5.62451C15.2542 5.01561 15.0074 4.43271 14.5702 4.00891L13.7547 3.21839C13.3349 2.81151 12.7733 2.58398 12.1887 2.58398H6.99578C5.75314 2.58398 4.74578 3.59134 4.74578 4.83398V6.36902C3.54391 6.41522 2.58374 7.40415 2.58374 8.61733V11.3827C2.58374 12.5959 3.54382 13.5848 4.74561 13.631V15.1665C4.74561 16.4091 5.75297 17.4165 6.99561 17.4165H13.0041C14.2467 17.4165 15.2541 16.4091 15.2541 15.1665V13.6311C16.456 13.585 17.4163 12.596 17.4163 11.3827V8.61733C17.4163 7.40414 16.4561 6.41521 15.2542 6.36902ZM4.74561 11.6217V12.1276C4.37292 12.084 4.08374 11.7671 4.08374 11.3827V8.61733C4.08374 8.20312 4.41953 7.86733 4.83374 7.86733H15.1663C15.5805 7.86733 15.9163 8.20312 15.9163 8.61733V11.3827C15.9163 11.7673 15.6269 12.0842 15.2541 12.1277V11.6217C15.2541 11.2075 14.9183 10.8717 14.5041 10.8717H5.49561C5.08139 10.8717 4.74561 11.2075 4.74561 11.6217ZM6.24561 12.3717V15.1665C6.24561 15.5807 6.58139 15.9165 6.99561 15.9165H13.0041C13.4183 15.9165 13.7541 15.5807 13.7541 15.1665V12.3717H6.24561Z"
                fill=""
              ></path>
            </svg>
            Çap et
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
