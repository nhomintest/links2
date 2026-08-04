import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLinksForUser } from "@/data/links";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateLinkDialog } from "@/app/dashboard/create-link-dialog";
import { EditLinkDialog } from "@/app/dashboard/edit-link-dialog";
import { DeleteLinkDialog } from "@/app/dashboard/delete-link-dialog";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const userLinks = await getLinksForUser(userId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Your links
        </h1>
        <CreateLinkDialog />
      </div>
      {userLinks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t added any links yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {userLinks.map((link) => (
            <li key={link.id}>
              <Card size="sm">
                <CardHeader>
                  <CardTitle>{link.originalUrl}</CardTitle>
                  <CardAction className="flex gap-1.5">
                    <EditLinkDialog link={link} />
                    <DeleteLinkDialog link={link} />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    /{link.shortCode}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
