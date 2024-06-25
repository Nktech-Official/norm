"use client";
import Image from "next/image";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import Link from "next/link";
import { Time, fileData } from "@/app/types";

function convertFileToDataURL(file: File) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (e) =>
      resolve({ dataURL: e.target?.result, name: file.name });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddQuestion() {
  const [files, setFiles] = useState<fileData[] | null>();
  const [time, setTime] = useState<Time>({ hours: 0, minutes: 5, seconds: 0 });

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const selectedFiles = e.target.files;
    const promises = [];

    // Loop through each selected file
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        promises.push(convertFileToDataURL(file));
      }

      try {
        const results = (await Promise.all(promises)) as fileData[];
        setFiles(results);
        localStorage.setItem("imgData", JSON.stringify(results));
      } catch (error) {
        console.error("Error converting files:", error);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("time", JSON.stringify(time));
  }, [time]);

  return (
    <>
      {files ? (
        <>
          <div className="flex w-full h-fit flex-wrap">
            {files.map((item, index) => {
              return (
                <Image
                  className="w-24 h-24 m-4 border"
                  key={index}
                  src={item.dataURL}
                  alt={item.name}
                  width={100}
                  height={100}
                />
              );
            })}
          </div>

          <form className="max-w-sm mx-auto">
            <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
              <div>
                <label htmlFor="code-1" className="sr-only">
                  hour
                </label>
                <input
                  onChange={(e) => {
                    setTime((prev) => {
                      return { ...prev, hours: parseInt(e.target.value) };
                    });
                  }}
                  value={time.hours}
                  min={0}
                  max={24}
                  type="number"
                  maxLength={2}
                  data-focus-input-init
                  data-focus-input-next="code-2"
                  id="code-1"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
                  placeholder="00"
                />
                <span className="text-xs font-light h-full flex justify-center items-center">
                  hour
                </span>
              </div>
              <span className="font-bold"> : </span>
              <div>
                <label htmlFor="code-2" className="sr-only">
                  minute{" "}
                </label>
                <input
                  onChange={(e) => {
                    setTime((prev) => {
                      return { ...prev, minutes: parseInt(e.target.value) };
                    });
                  }}
                  max={59}
                  min={0}
                  value={time.minutes}
                  type="number"
                  maxLength={2}
                  data-focus-input-init
                  data-focus-input-prev="code-1"
                  data-focus-input-next="code-3"
                  id="code-2"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
                  placeholder="00"
                />
                <span className="text-xs font-light h-full flex justify-center items-center">
                  minute
                </span>
              </div>
              <span className="font-bold"> : </span>

              <div>
                <label htmlFor="code-3" className="sr-only">
                  second
                </label>
                <input
                  onChange={(e) => {
                    setTime((prev) => {
                      return { ...prev, seconds: parseInt(e.target.value) };
                    });
                  }}
                  max={59}
                  min={0}
                  value={time.seconds}
                  type="number"
                  maxLength={2}
                  data-focus-input-init
                  data-focus-input-prev="code-2"
                  data-focus-input-next="code-4"
                  id="code-3"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
                  placeholder="00"
                />
                <span className="text-xs font-light h-full flex justify-center items-center">
                  second
                </span>
              </div>
            </div>
          </form>
          <Link
            href="/question"
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Start
          </Link>
        </>
      ) : (
        <form>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 "
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            onChange={handleChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none "
            id="file_input"
            type="file"
            accept="image/*"
            multiple
          />
        </form>
      )}
    </>
  );
}
