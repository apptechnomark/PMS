/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import FileIcon from "@/assets/icons/worklogs/FileIcon";
interface ImageUploaderProps {
  getData: (name: string, fileName: string) => void;
}

export default function ImageUploader({ getData, onClose }: any) {
  const [fileData, setFileData] = useState<any>(null);
  const [selectedFileDisplay, setSelectedFileDisplay] = useState<any>("");

  useEffect(() => {
    setFileData(null);
    setSelectedFileDisplay("");
  }, [onClose]);

  const handleImageChange = async (event: any) => {
    const fileData = event.target.files[0];
    console.log(fileData)
    if (fileData) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(fileData);
        reader.onloadend = async () => {
          let base64Image: any;
          if (reader.result) {
            base64Image = reader.result as string;
            // setFileData(base64Image);
          }
          const uuidv4 = () => {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
              /[xy]/g,
              function (c) {
                const r = (Math.random() * 16) | 0,
                  v = c == "x" ? r : (r & 0x3) | 0x8;

                return v.toString(16);
              }
            );
          };
          const fileName = uuidv4().slice(0, 32);
          await axios
            .post("/api/upload", { base64Image, fileName })
            .then(async (res) => {
              if (res.status === 200) {
                setSelectedFileDisplay(fileData);
                getData(fileData.name, fileName);
                await fetch("/api/getupload", {
                  method: "POST",
                  body: JSON.stringify({
                    fileName: fileName,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }).then(async (res) => {
                  if (res.status === 200) {
                    const data = await res.json();
                    console.log(data.data);
                    setFileData(data.data);
                  }
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        };
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderFileContent = () => {
    if (selectedFileDisplay) {
      if (selectedFileDisplay.type?.includes("image")) {
        return (
          <img
            src={fileData}
            alt="Image Preview"
            style={{ maxWidth: "200px" }}
          />
        );
      } else if (selectedFileDisplay.name.endsWith(".pdf")) {
        return (
          <embed
            src={fileData}
            width="100%"
            height="300px"
            type="application/pdf"
          />
        );
      } else {
        return <p>Unsupported File Type: {selectedFileDisplay.name}</p>;
      }
    } else {
      return <p>No file selected</p>;
    }
  };

  return (
    <div className="flex gap-2">
      {/* <input type="file" accept="image/*,.pdf" onChange={handleImageChange} /> */}
      <span
        className="text-white cursor-pointer max-w-1"
        onClick={() => fileInputRef.current?.click()}
      >
        <FileIcon />
        <input
          type="file"
          accept="image/*,.pdf"
          ref={fileInputRef}
          multiple
          className="input-field hidden"
          onChange={handleImageChange}
        />
      </span>
      <div>{fileData && renderFileContent()}</div>
    </div>
  );
}
