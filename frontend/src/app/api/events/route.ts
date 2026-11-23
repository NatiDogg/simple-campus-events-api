import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.CLASSROOM_API_KEY;

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json({ message: "API URL is not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY ?? "",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Cannot reach the backend" }, { status: 502 });
  }
}