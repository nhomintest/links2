import { notFound, redirect } from "next/navigation";
import { getLinkByShortCode } from "@/data/links";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;
  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    notFound();
  }

  redirect(link.originalUrl);
}
