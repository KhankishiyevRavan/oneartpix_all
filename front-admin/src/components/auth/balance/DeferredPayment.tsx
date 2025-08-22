export default function DeferredPayment({
  amount,
  connectedAt,
}: {
  amount: number;
  connectedAt: string;
}) {
  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <h4 className="font-semibold text-gray-800">Gecikmiş Ödəniş</h4>
      <p>
        Qoşulma tarixi: {connectedAt} <br />
        Borc: <strong>{amount} ₼</strong>
      </p>
    </div>
  );
}
