"use client";

import { useEffect, useRef, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function UserCheckClient({ error }: { error: string }) {
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const signedOut = useRef(false);

  useEffect(() => {
    // ❌ Skip showing popup for "Not signed in"
    if (error && error !== "Not signed in" && !signedOut.current) {
      setOpen(true);
    }
  }, [error]);

  const handleClose = () => {
    signedOut.current = true;
    setOpen(false);
    setTimeout(() => {
      signOut();
    }, 300);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Account Disabled</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          {error || "Your account has been disabled or deleted."}
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
  