"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { Time, fileData } from "@/app/types";

export default function Question() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [files, setFiles] = useState<fileData[] | null>();
  const [time, setTime] = useState<Time>({ hours: 0, minutes: 5, seconds: 0 });
  const [timeUp, setTimeUp] = useState(false);
  useEffect(() => {
    const data = localStorage.getItem("imgData");
    const timeData = localStorage.getItem("time");
    if (data) {
      setFiles(JSON.parse(data));
    }
    if (timeData) {
      setTime(JSON.parse(timeData));
    }
  }, []);
  useEffect(() => {
    const intervalID = setTimeout(() => {
      console.log(time);

      if (time.seconds === 0) {
        console.log(time);

        if (time.minutes === 0) {
          if (time.hours === 0) {
            clearTimeout(intervalID);
            setTimeUp(true);
          } else {
            setTime((prev) => ({
              hours: prev.hours - 1,
              minutes: 59,
              seconds: 59,
            }));
          }
        } else {
          setTime((prev) => ({
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59,
          }));
        }
      } else {
        setTime((prev) => ({
          ...prev,
          seconds: prev.seconds - 1,
        }));
      }
    }, 1000);

    return () => {
      clearTimeout(intervalID);
    };
  }, [time]);

  return (
    <div className="flex  flex-col-reverse lg:flex-row">
      <div className="w-[200px] lg:h-screen overflow-y-scroll overflow-x-hidden no-scrollbar">
        {files?.map((item, index) => {
          return (
            <div
              key={index}
              className={`h-14 flex items-center pl-5 my-2 cursor-pointer ${
                index === currentImage ? "text-green-500 bg-slate-700" : ""
              }`}
              onClick={() => {
                console.log(index);
                setCurrentImage(index);
              }}
            >
              <p>{index + 1}</p>
              <Image
                className={`rounded-full m-4 object-cover w-12 h-12 ${
                  timeUp ? "filter blur-sm" : ""
                }`}
                src={item.dataURL}
                alt={item.name}
                width={50}
                height={50}
              />
              <p>{item.name.substring(0, 10)}</p>
            </div>
          );
        })}
      </div>
      <div className="lg:grow flex flex-col relative lg:h-screen justify-center items-center ">
        <div className="flex w-4/5 justify-end">
          <button
            onClick={() => {
              const timeData = localStorage.getItem("time");
              if (timeData) setTime(JSON.parse(timeData));
              else setTime({ hours: 0, minutes: 5, seconds: 0 });
              setTimeUp(false);
            }}
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 mx-5"
          >
            Reset Timer
          </button>

          <button
            onClick={() => {
              router.push("/");
            }}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 mx-5"
          >
            Start New Session
          </button>
          <div className="mx-5 flex justify-center items-center text-2xl font-bold">
            <span className="mx-3">
              {time.hours < 9 ? "0" + time.hours : time.hours}
            </span>
            :
            <span className="mx-3">
              {time.minutes < 9 ? "0" + time.minutes : time.minutes}
            </span>
            :
            <span className="mx-3">
              {time.seconds < 9 ? "0" + time.seconds : time.seconds}
            </span>
          </div>
        </div>

        {files ? (
          <div className="h-4/5 w-full flex justify-center items-center">
            <Image
              className={`rounded-lg m-4 w-4/5 h-4/5 ${
                timeUp ? "filter blur-xl" : ""
              }`}
              src={files[currentImage].dataURL}
              alt={files[currentImage]?.name}
              width={600}
              height={400}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
