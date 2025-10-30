import { verifyEstimateActionToken } from "@/lib/tokens";
import { getEstimate } from "@/lib/estimates";
import { redirect } from "next/navigation";

export default async function EditEstimatePage({
  searchParams,
  params,
}: {
  searchParams: { token?: string };
  params: { id: string };
}) {
  const token = searchParams?.token;
  if (!token) return redirect("/");
  try {
    const payload = await verifyEstimateActionToken(token);
    if (payload.action !== "edit" || payload.estimateId !== params.id)
      return redirect("/");
    const estimate = getEstimate(params.id);
    if (!estimate) return redirect("/");
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Edit Estimate</h1>
        <p className="text-sm text-muted-foreground mb-6">
          For {estimate.formData.contactDetails.clientName}
        </p>
        <div className="p-4 border rounded">
          This is a placeholder edit page. Implement form to adjust pricing and
          details, then send updated estimate to client.
        </div>
      </div>
    );
  } catch {
    return redirect("/");
  }
}
