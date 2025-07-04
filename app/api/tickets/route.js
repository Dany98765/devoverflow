import { NextResponse } from "next/server";
import tickets from "../../tickets";

export async function GET() {
    return NextResponse.json(tickets)
}
export async function POST(request) {
    const ticket = await request.json()
    tickets.push({
        id: tickets.length + 1,
        ...ticket
    })
    return NextResponse.json(tickets)
}
