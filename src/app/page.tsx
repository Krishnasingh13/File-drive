"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Header from "./Header";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const page = () => {
  const files = useQuery(api.files.getFiles);
  const createFile = useMutation(api.files.createFile);

  return (
    <div>
      <Header />

      <div className=" flex items-center justify-center flex-col">
        {files?.map((file) => {
          return <div key={file._id}>{file.name}</div>;
        })}

        <Button
          onClick={() => {
            createFile({
              name: "hello world",
            });
          }}
        >
          Click Me
        </Button>
      </div>
    </div>
  );
};

export default page;
