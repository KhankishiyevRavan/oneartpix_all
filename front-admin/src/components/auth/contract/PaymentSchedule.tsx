// components/contract/PaymentSchedule.tsx
import { useMemo } from "react";
import { CheckCircle2, Clock, CircleDollarSign } from "lucide-react";

export interface PaymentScheduleItem {
  _id?: string;
  month: string; // "mart 2025" və s.
  amount: number; // 12 və s.
  status: "paid" | "unpaid";
  paidAt?: string | null;
  paymentId?: string | null;
}

export default function PaymentSchedule({
  schedule,
  onPayClick,
  currency = "₼",
}: {
  schedule: PaymentScheduleItem[];
  onPayClick?: (item: PaymentScheduleItem) => void;
  currency?: string;
}) {
  const { totalMonths, paidMonths, totalAmount, paidAmount, progress } =
    useMemo(() => {
      const t = schedule.length;
      const p = schedule.filter((m) => m.status === "paid");
      const ta = schedule.reduce((s, m) => s + (m.amount || 0), 0);
      const pa = p.reduce((s, m) => s + (m.amount || 0), 0);
      const pr = t ? Math.round((p.length / t) * 100) : 0;
      return {
        totalMonths: t,
        paidMonths: p.length,
        totalAmount: ta,
        paidAmount: pa,
        progress: pr,
      };
    }, [schedule]);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ödənilib</p>
            <p className="font-semibold">
              {paidMonths} / {totalMonths} ay
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
          <CircleDollarSign className="w-5 h-5" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ödənilən məbləğ
            </p>
            <p className="font-semibold">
              {paidAmount} {currency} / {totalAmount} {currency}
            </p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Proqres
          </p>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 dark:bg-green-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-medium">{progress}%</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />{" "}
          Ödənilib
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />{" "}
          Gözləmədə
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {schedule.map((item) => {
          const paid = item.status === "paid";
          return (
            <div
              key={item._id ?? item.month}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ay</p>
                  <p className="font-semibold">{item.month}</p>
                </div>
                <span
                  className={
                    "text-[11px] px-2 py-1 rounded-full font-medium " +
                    (paid
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300")
                  }
                >
                  {paid ? "ödənilib" : "ödənilməyib"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Məbləğ
                  </p>
                  <p className="font-semibold">
                    {item.amount} {currency}
                  </p>
                </div>
                {paid ? (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    <div className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {item.paidAt
                        ? formatAzDateTime(item.paidAt)
                        : "Təsdiqlənib"}
                    </div>
                    {item.paymentId && (
                      <div className="mt-1">ID: {shorten(item.paymentId)}</div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPayClick?.(item)}
                    className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Clock className="w-4 h-4" />
                    Ödə
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function shorten(id: string) {
  return id.length > 6 ? `${id.slice(0, 4)}…${id.slice(-3)}` : id;
}

function formatAzDateTime(d: string) {
  const date = new Date(d);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${mi}`;
}
