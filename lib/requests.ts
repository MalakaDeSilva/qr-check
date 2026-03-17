import { nanoid } from "nanoid";
import { getRequestsCollection } from "./db";
import type { RequestDoc, CreateRequestInput, RequestStatus } from "./types";

const FUELPASS_URL = "https://fuelpass.gov.lk";

export async function createRequest(input: CreateRequestInput): Promise<RequestDoc> {
  const col = await getRequestsCollection();
  const id = nanoid(10);
  const doc: RequestDoc = {
    id,
    registrationNumber: normalizeRegNo(input.registrationNumber),
    message: input.message?.trim() || undefined,
    notifyEmail: input.notifyEmail?.trim() || undefined,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  await col.insertOne(doc as never);
  return doc;
}

export async function getRequestById(id: string): Promise<RequestDoc | null> {
  const col = await getRequestsCollection();
  const doc = await col.findOne({ id });
  return doc as RequestDoc | null;
}

export async function markReleased(id: string): Promise<RequestDoc | null> {
  const col = await getRequestsCollection();
  const result = await col.findOneAndUpdate(
    { id, status: "open" },
    {
      $set: {
        status: "released" as RequestStatus,
        releasedAt: new Date().toISOString(),
      },
    },
    { returnDocument: "after" }
  );
  return result as RequestDoc | null;
}

export async function markConfirmed(id: string): Promise<RequestDoc | null> {
  const col = await getRequestsCollection();
  const result = await col.findOneAndUpdate(
    { id },
    {
      $set: {
        status: "confirmed" as RequestStatus,
        confirmedAt: new Date().toISOString(),
      },
    },
    { returnDocument: "after" }
  );
  return result as RequestDoc | null;
}

export async function listRequests(options?: {
  status?: RequestStatus;
  search?: string;
  limit?: number;
}): Promise<RequestDoc[]> {
  const col = await getRequestsCollection();
  const filter: Record<string, unknown> = {};
  if (options?.status) filter.status = options.status;
  if (options?.search?.trim()) {
    filter.registrationNumber = { $regex: escapeRegExp(options.search.trim()), $options: "i" };
  }
  const limit = Math.min(options?.limit ?? 100, 200);
  const cursor = col.find(filter).sort({ createdAt: -1 }).limit(limit);
  const list = await cursor.toArray();
  return list as RequestDoc[];
}

function normalizeRegNo(reg: string): string {
  return reg.trim().toUpperCase();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export { FUELPASS_URL };
