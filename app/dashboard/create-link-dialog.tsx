"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
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
import { createLinkAction } from "@/app/dashboard/actions";

export function CreateLinkDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      setUrl("");
      setCustomSlug("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createLinkAction({ originalUrl: url, customSlug });
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
      <DialogTrigger render={<Button />}>
        <PlusIcon />
        New link
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new link</DialogTitle>
          <DialogDescription>
            Paste a URL to generate a shortened link.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="originalUrl">URL</Label>
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com/my-long-link"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customSlug">Custom slug (optional)</Label>
            <Input
              id="customSlug"
              type="text"
              placeholder="my-custom-slug"
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
              maxLength={32}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
