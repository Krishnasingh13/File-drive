import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";

import Image from "next/image";
import { ReactNode } from "react";
import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { FileCardActions } from "./file-actions";

export function FileCard({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean, url: string | null };
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  return (
    <div>
      <Card>
        <CardHeader className=" relative px-5">
          <CardTitle className="flex gap-2 capitalize">
            <div className="flex justify-center">{typeIcons[file.type]}</div>{" "}
            {file.name}
          </CardTitle>
          <div className="absolute top-2 right-2">
            <FileCardActions file={file} isFavorited={file.isFavorited} />
          </div>
        </CardHeader>
        <CardContent className="h-[200px] flex justify-center items-center px-10">
          {file.type === "image" && file.url && (
            <Image
              alt={file.name}
              width="400"
              height="100"
              src={file.url}
              quality={100}
            />
          )}

          {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
          {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 text-xs text-gray-700 w-40 items-start p-0">
            <Avatar className="w-12 h-8 rounded-full overflow-hidden">
              <AvatarImage src={userProfile?.image} className="w-full h-full" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className=" text-sm font-semibold">{userProfile?.name}</h1>
              <div className="text-xs text-gray-700 font-semibold">
                Uploaded on{" "}
                {formatRelative(new Date(file._creationTime), new Date())}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
