export default function BalanceHeader({
  balance,
  expiryDate,
}: {
  balance: number;
  expiryDate: string;
}) {
  return (
    <div className="text-lg font-medium text-gray-700">
      <p>💰 Balans: {balance} ₼</p>
      <p className="text-sm text-gray-500">Bitmə tarixi: {expiryDate}</p>
    </div>
  );
}
