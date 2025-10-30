import { NextRequest, NextResponse } from "next/server";
import { verifyEstimateActionToken } from "@/lib/tokens";
import {
  getEstimate,
  isJtiUsed,
  markJtiUsed,
  updateEstimateStatus,
} from "@/lib/estimates";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const token = req.nextUrl.searchParams.get("token");
  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  try {
    const payload = (await verifyEstimateActionToken(token)) as {
      action: string;
      estimateId: string;
      jti?: string;
    };
    if (payload.action !== "accept")
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    if (payload.estimateId !== id)
      return NextResponse.json(
        { error: "Mismatched estimate" },
        { status: 400 }
      );
    if (payload.jti && isJtiUsed(payload.jti))
      return NextResponse.json({ error: "Link already used" }, { status: 400 });

    const estimate = getEstimate(id);
    if (!estimate)
      return NextResponse.json(
        { error: "Estimate not found" },
        { status: 404 }
      );

    updateEstimateStatus(id, "accepted");
    if (payload.jti) {
      markJtiUsed(payload.jti);
    }

    const redirectUrl = process.env.APP_BASE_URL
      ? `${process.env.APP_BASE_URL}/business/estimates/${id}/accepted`
      : `/business/estimates/${id}/accepted`;

    return NextResponse.redirect(redirectUrl);
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
