"use client";
import { useQuery } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { SearchBar } from "./search-bar";
import { FileCard } from "./file-card";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">You have no files, upload one now</div>
      <UploadButton />
    </div>
  );
}

export function FileBrowser({
  title,
  favoritesOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
}) {
  const [query, setQuery] = useState("");
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favoritesOnly } : "skip"
  );
  console.log(files);
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>

        <div className="flex items-center gap-3">
          <SearchBar query={query} setQuery={setQuery} />

          <UploadButton />
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-20 w-20 animate-spin text-gray-500" />
          <div className="text-xl">Loading your images...</div>
        </div>
      )}

      {files?.length === 0 && <Placeholder />}

      {!isLoading && files.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {files?.map((file) => {
              return (
                <FileCard
                  favorites={favorites ?? []}
                  key={file._id}
                  file={file}
                />
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
