"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLinkAction } from "@/app/dashboard/actions";
import type { Link } from "@/db/schema";

export function EditLinkDialog({ link }: { link: Link }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(link.originalUrl);
  const [customSlug, setCustomSlug] = useState(link.shortCode);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      setUrl(link.originalUrl);
      setCustomSlug(link.shortCode);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateLinkAction({
        linkId: link.id,
        originalUrl: url,
        customSlug,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      handleOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
        <PencilIcon />
        <span className="sr-only">Edit link</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>
            Update the destination URL or short code.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`originalUrl-${link.id}`}>URL</Label>
            <Input
              id={`originalUrl-${link.id}`}
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`customSlug-${link.id}`}>Short code</Label>
            <Input
              id={`customSlug-${link.id}`}
              type="text"
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
              maxLength={32}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
