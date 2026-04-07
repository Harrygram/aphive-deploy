"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { updateCommunity } from "@/action/updateCommunity";
import { useRouter } from "next/navigation";

export default function EditCommunityDialog({
  community,
  children,
}: {
  community: any;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(community.title || "");
  const [slug] = useState(community.slug || ""); // Slug is read-only
  const [description, setDescription] = useState(community.description || "");
  const [imagePreview, setImagePreview] = useState(community.image?.base64 || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      try {
        let base64 = imagePreview;
        if (imageFile) {
          const reader = new FileReader();
          base64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(imageFile);
          });
        }

        await updateCommunity(community.id, {
        title: name.trim(),
        description: description.trim(),
        image: base64
            ? {
                base64,
                filename: imageFile?.name || "image.png",
                contentType: imageFile?.type || "image/png",
            }
            : null,
        });


        router.refresh();
        setOpen(false);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to update community.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Community</DialogTitle>
          <DialogDescription>
            Update the details of your community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

          <div>
            <label className="text-sm font-medium">Community Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Community Slug</label>
            <Input
              value={slug}
              disabled
              className="bg-gray-100 dark:bg-[#1f1f1f] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Community Image (optional)</label>
            {imagePreview ? (
              <div className="relative w-24 h-24 mx-auto">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                >
                  x
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer bg-gray-50 dark:bg-[#202124] hover:bg-gray-100 dark:hover:bg-[#2b2b2e]">
                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-xs text-gray-500">Click to upload an image</p>
                <input
                  type="file"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Update Community"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
