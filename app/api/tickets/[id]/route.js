import tickets from "@/app/tickets"
import { NextResponse } from "next/server"

export async function GET(_, { params }) {
    const { id } = await params
    const ticket = tickets.find((ticket) => ticket.id === parseInt(id))
    return NextResponse.json(ticket)
}

export async function PUT(request, { params }) {
    const { id } = await params
    const { name, type, bug } = await request.json()
    const ticket = tickets.find((ticket) => ticket.id === parseInt(id))
    if (!ticket) return NextResponse.json(new Error("Ticket not found!"), { status: 404 })
    if (name) ticket.name = name
    if (type) ticket.type = type
    if (bug) ticket.bug = bug
    return NextResponse.json(ticket)
}
export async function DELETE(_, { params }) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Ticket id is required" });
  
    const parsedId = Number(id);
    if (Number.isNaN(parsedId))
      return NextResponse.json({ error: "Ticket id must be a number" });
  
    const ticket = tickets.find((ticket) => ticket.id === parsedId);
    if (!ticket) return NextResponse.json({ error: "Ticket not found" });
  
    tickets.splice(tickets.indexOf(ticket), 1);
  
    return NextResponse.json(ticket);
  }

