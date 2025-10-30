import { Resend } from "resend";
import { PAINTING_CONSTANTS } from "@/components/painting-estimator/types";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType?: string;
  }>;
}) {
  // For testing: use Resend's test domain if no verified domain is set
  const defaultFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const from = params.from || defaultFrom;

  if (!resend) {
    console.log("[email:dev] Email would be sent:", {
      to: params.to,
      subject: params.subject,
      from,
      html: params.html.substring(0, 100) + "...",
    });
    return { id: "dev-email", success: true } as const;
  }
  try {
    const result = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: params.attachments,
    });
    if (result.error) {
      throw new Error(result.error.message || "Failed to send email");
    }
    return result;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("[email:error]", err);
    throw new Error(err?.message || "Failed to send email via Resend");
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}

function formatHours(hours: number): string {
  return hours.toFixed(1);
}

export function buildBusinessEmailHtml(params: {
  clientName: string;
  estimateLinkAccept: string;
  estimateLinkEdit: string;
  formData: {
    contactDetails?: {
      clientName?: string;
      email?: string;
      phone?: string;
      address?: string;
      suburb?: string;
      state?: string;
      postcode?: string;
    };
    paintingDetails?: {
      dimensions?: { length?: number; width?: number; height?: number };
      paintQuality?: { quality?: string; pricePerLitre?: number };
      numberOfCoats?: number;
      roomType?: string;
      scope?: string;
    };
  };
  calculation: {
    totalArea?: number;
    grandTotal?: number;
    materialsSubtotal?: number;
    labourSubtotal?: number;
    totalLabourHours?: number;
    totalPaintLitres?: number;
    totalPaintCost?: number;
    ancillaryMaterialsCost?: number;
    gstAmount?: number;
    totalIncludingGst?: number;
    wallArea?: number;
    ceilingArea?: number;
    priceData?: {
      isRealTime?: boolean;
      paintProducts?: Array<{ name: string; brand: string; price: number }>;
    };
  };
  imagesBase64?: Array<{ name: string; type: string; dataUrl: string }>;
}) {
  const { formData, calculation } = params;
  const { paintingDetails } = formData || {};
  const { dimensions, paintQuality, numberOfCoats, roomType, scope } =
    paintingDetails || {};

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case "good":
        return "Good Quality";
      case "better":
        return "Better Quality";
      case "best":
        return "Best Quality";
      default:
        return quality;
    }
  };

  const gstAmount =
    calculation?.gstAmount || (calculation?.grandTotal || 0) * 0.1;
  const totalIncludingGst =
    calculation?.totalIncludingGst ||
    (calculation?.grandTotal || 0) + gstAmount;
  const materialCost = calculation?.materialsSubtotal || 0;
  const labourCost = calculation?.labourSubtotal || 0;
  const totalCost = materialCost + labourCost;
  const profitMargin = (
    calculation?.grandTotal
      ? ((calculation.grandTotal - totalCost) / calculation.grandTotal) * 100
      : 0
  ).toFixed(1);

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1f2937;margin-bottom:20px">New Painting Estimate for ${
        params.clientName
      }</h2>
      
      <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:20px">
        <h3 style="color:#374151;margin-top:0;margin-bottom:12px">Project Details</h3>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Room:</strong></td><td style="padding:4px 0;color:#1f2937">${
            roomType || "N/A"
          }</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Scope:</strong></td><td style="padding:4px 0;color:#1f2937">${
            scope || "N/A"
          }</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Dimensions:</strong></td><td style="padding:4px 0;color:#1f2937">${
            dimensions?.length || 0
          }m × ${dimensions?.width || 0}m × ${
    dimensions?.height || 0
  }m</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Paint Quality:</strong></td><td style="padding:4px 0;color:#1f2937">${getQualityLabel(
            paintQuality?.quality || ""
          )}</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Number of Coats:</strong></td><td style="padding:4px 0;color:#1f2937">${
            numberOfCoats || 0
          }</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Total Area:</strong></td><td style="padding:4px 0;color:#1f2937">${
            calculation?.totalArea?.toFixed(1) || "0.0"
          } m²</td></tr>
        </table>
      </div>

      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
        <h3 style="color:#374151;margin-top:0;margin-bottom:12px">Profit Analysis</h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <div style="flex:1;min-width:160px;text-align:center;padding:12px;background:#ecfdf5;border:1px solid #10b98133;border-radius:8px">
            <div style="color:#065f46;font-weight:600;margin-bottom:4px">Total Revenue</div>
            <div style="color:#065f46;font-size:16px;font-weight:700">${formatCurrency(
              calculation?.grandTotal || 0
            )}</div>
          </div>
          <div style="flex:1;min-width:160px;text-align:center;padding:12px;background:#fef2f2;border:1px solid #ef444433;border-radius:8px">
            <div style="color:#7f1d1d;font-weight:600;margin-bottom:4px">Total Costs</div>
            <div style="color:#7f1d1d;font-size:16px;font-weight:700">${formatCurrency(
              totalCost
            )}</div>
          </div>
          <div style="flex:1;min-width:160px;text-align:center;padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px">
            <div style="color:#111827;font-weight:600;margin-bottom:4px">Profit Margin</div>
            <div style="color:#2563eb;font-size:16px;font-weight:700">${profitMargin}%</div>
          </div>
        </div>
      </div>

      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
        <h3 style="color:#374151;margin-top:0;margin-bottom:12px">Timeline & Scheduling</h3>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Preparation Time:</strong></td><td style="padding:4px 0;color:#1f2937">1-2 days</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Painting Time:</strong></td><td style="padding:4px 0;color:#1f2937">${Math.ceil(
            (calculation?.totalLabourHours || 0) / 8
          )} days</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Total Duration:</strong></td><td style="padding:4px 0;color:#1f2937">${
            Math.ceil((calculation?.totalLabourHours || 0) / 8) + 2
          } days</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280"><strong>Labour Hours:</strong></td><td style="padding:4px 0;color:#1f2937">${formatHours(
            calculation?.totalLabourHours || 0
          )} hours</td></tr>
        </table>
      </div>

      ${
        calculation?.priceData?.paintProducts &&
        calculation.priceData.paintProducts.length > 0
          ? `<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
              <h3 style=\"color:#374151;margin-top:0;margin-bottom:12px\">Recommended Paint Products (${
                calculation.priceData?.isRealTime ? "Live Prices" : ""
              })</h3>
              <div>
                ${calculation.priceData.paintProducts
                  .map(
                    (p: { name: string; brand: string; price: number }) => `
                  <div style=\"display:flex;justify-content:space-between;align-items:center;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:8px\">\n                    <div>\n                      <div style=\"font-weight:600;color:#111827\">${
                    p.name
                  }</div>\n                      <div style=\"font-size:12px;color:#2563eb\">${
                      p.brand
                    }</div>\n                    </div>\n                    <div style=\"text-align:right\">\n                      <div style=\"font-weight:600;color:#111827\">${formatCurrency(
                      p.price
                    )}</div>\n                      <div style=\"font-size:12px;color:#2563eb\">per 4L</div>\n                    </div>\n                  </div>`
                  )
                  .join("")}
              </div>
            </div>`
          : ""
      }

      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
        <h3 style="color:#374151;margin-top:0;margin-bottom:16px">Cost Breakdown</h3>
        
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr style="background:#f3f4f6">
            <td colspan="2" style="padding:8px;font-weight:bold;color:#374151">Material Costs</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;color:#6b7280;border-bottom:1px solid #e5e7eb">Paint (${
              calculation?.totalPaintLitres || 0
            }L)</td>
            <td style="padding:6px 8px;text-align:right;color:#1f2937;border-bottom:1px solid #e5e7eb">${formatCurrency(
              calculation?.totalPaintCost || 0
            )}</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;color:#6b7280;border-bottom:1px solid #e5e7eb">Ancillary Materials</td>
            <td style="padding:6px 8px;text-align:right;color:#1f2937;border-bottom:1px solid #e5e7eb">${formatCurrency(
              calculation?.ancillaryMaterialsCost || 0
            )}</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;font-weight:bold;color:#374151">Subtotal Materials</td>
            <td style="padding:6px 8px;text-align:right;font-weight:bold;color:#1f2937">${formatCurrency(
              calculation?.materialsSubtotal || 0
            )}</td>
          </tr>
        </table>

        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr style="background:#f3f4f6">
            <td colspan="2" style="padding:8px;font-weight:bold;color:#374151">Labour Costs</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;color:#6b7280;border-bottom:1px solid #e5e7eb">Wall Painting (${(
              calculation?.wallArea ?? 0
            ).toFixed(1)} m² @ ${PAINTING_CONSTANTS.WALL_SPEED} m²/hr)</td>
            <td style="padding:6px 8px;text-align:right;color:#1f2937;border-bottom:1px solid #e5e7eb">${formatCurrency(
              ((calculation?.wallArea || 0) / PAINTING_CONSTANTS.WALL_SPEED) *
                PAINTING_CONSTANTS.LABOUR_RATE
            )}</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;color:#6b7280;border-bottom:1px solid #e5e7eb">Ceiling Painting (${(
              calculation?.ceilingArea ?? 0
            ).toFixed(1)} m² @ ${PAINTING_CONSTANTS.CEILING_SPEED} m²/hr)</td>
            <td style="padding:6px 8px;text-align:right;color:#1f2937;border-bottom:1px solid #e5e7eb">${formatCurrency(
              ((calculation?.ceilingArea || 0) /
                PAINTING_CONSTANTS.CEILING_SPEED) *
                PAINTING_CONSTANTS.LABOUR_RATE
            )}</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;font-weight:bold;color:#374151">Subtotal Labour</td>
            <td style="padding:6px 8px;text-align:right;font-weight:bold;color:#1f2937">${formatCurrency(
              calculation?.labourSubtotal || 0
            )}</td>
          </tr>
        </table>

        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px;font-weight:bold;color:#374151;border-top:2px solid #e5e7eb">Subtotal (Excl. GST)</td>
            <td style="padding:8px;text-align:right;font-weight:bold;color:#1f2937;border-top:2px solid #e5e7eb">${formatCurrency(
              calculation?.grandTotal || 0
            )}</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;color:#6b7280">GST (10%)</td>
            <td style="padding:6px 8px;text-align:right;color:#1f2937">${formatCurrency(
              gstAmount
            )}</td>
          </tr>
          <tr style="background:#eff6ff">
            <td style="padding:10px 8px;font-weight:bold;font-size:18px;color:#1e40af;border-top:2px solid #3b82f6">Total (Incl. GST)</td>
            <td style="padding:10px 8px;text-align:right;font-weight:bold;font-size:18px;color:#1e40af;border-top:2px solid #3b82f6">${formatCurrency(
              totalIncludingGst
            )}</td>
          </tr>
        </table>
      </div>
      
      <div style="margin:24px 0;text-align:center">
        <p style="margin-bottom:16px;color:#374151">Please review the estimate and choose an action:</p>
        <div style="margin-bottom:16px">
          <a href="${
            params.estimateLinkAccept
          }" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin-right:12px">Accept Estimate</a>
          <a href="${
            params.estimateLinkEdit
          }" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Edit Estimate</a>
        </div>
        <p style="font-size:12px;color:#6b7280;margin:0">These links expire in 24 hours for security.</p>
      </div>
    </div>
  `;
}
