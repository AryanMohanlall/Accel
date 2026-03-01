import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Stream credentials not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const userName = searchParams.get("userName");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    // Upsert the user into Stream so they exist before any channel operations
    await serverClient.upsertUser({
      id: userId,
      name: userName ?? userId,
    });

    const token = serverClient.createToken(userId);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Stream token error:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}