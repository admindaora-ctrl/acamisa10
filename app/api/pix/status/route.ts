import { type NextRequest, NextResponse } from "next/server"
import { getPixStatus } from "@/lib/pix"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "id é obrigatório." }, { status: 400 })
  }
  try {
    const status = await getPixStatus(id)
    return NextResponse.json({ id, status })
  } catch (err) {
    console.error("[v0] Erro ao consultar status PIX:", err)
    return NextResponse.json({ id, status: "pending" })
  }
}
