import { SignJWT, jwtVerify } from "jose"; 

const secretKey = () => {
  const key = process.env.ESTIMATE_JWT_SECRET;
  if (!key) throw new Error("ESTIMATE_JWT_SECRET is not set");
  return new TextEncoder().encode(key);
};

export type EstimateAction = "accept" | "edit";

export interface EstimateTokenPayload {
  estimateId: string;
  businessEmail: string;
  action: EstimateAction;
}

export async function createEstimateActionToken(params: {
  estimateId: string;
  businessEmail: string;
  action: EstimateAction;
  jti: string;
  expSeconds?: number;
}) {
  const exp =
    Math.floor(Date.now() / 1000) + (params.expSeconds ?? 60 * 60 * 24);
  return await new SignJWT({
    estimateId: params.estimateId,
    businessEmail: params.businessEmail,
    action: params.action,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(params.jti)
    .setExpirationTime(exp)
    .sign(secretKey());
}

export async function verifyEstimateActionToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey());
  return payload as unknown as {
    estimateId: string;
    businessEmail: string;
    action: EstimateAction;
    jti: string;
    exp: number;
  };
}
