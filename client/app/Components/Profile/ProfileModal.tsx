"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import useDetectOutside from "@/hooks/useDetectOutside";
import { badge, check, github, mail } from "@/utils/Icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function ProfileModal() {
  const ref = React.useRef(null);

  const { closeModal } = useTasks();
  const { user, updateUser, handlerUserInput, userState, changePassword } =
    useUserContext();

  useDetectOutside({
    ref,
    callback: () => {
      closeModal();
    },
  });

  const { name, email, photo } = user;

  //state
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const handlePassword = (type: string) => (e: any) => {
    if (type === "old") {
      setOldPassword(e.target.value);
    } else {
      setNewPassword(e.target.value);
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <div
        ref={ref}
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md border-2 border-white"
      >
        <div className="absolute left-0 top-0 w-full h-[80px] bg-[#323232]/10 rounded-tr-md rounded-tl-md"></div>

        <div className="mt-4 relative flex justify-between">
          <div className="relative inline-block">
            <Image
              src={photo}
              alt="profile"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="absolute bottom-0 right-1 shadow-sm">
              <span className="text-lg text-blue-400">{badge}</span>
              <span className="absolute z-20 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-xs text-white">
                {check}
              </span>
            </div>
          </div>
          <div className="self-end flex items-center gap-2">
            <button className="flex items-center gap-2 border-2 border-[#323232]/10 rounded-md py-1 px-3 text-xs font-medium text-[#323232]">
              {github} Github
            </button>
            <button className="flex items-center gap-2 border-2 border-[#323232]/10 rounded-md py-1 px-3 text-xs font-medium text-[#323232]">
              {check} Verified
            </button>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold">{name}</h1>
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        <form
          action=""
          className="mt-4 pt-2 flex flex-col gap-4 border-t-2 border-t-[#323232]/10"
          onSubmit={(e) => {
            e.preventDefault();
            updateUser(e, {
              name: userState.name,
              email: userState.email,
            });
          }}
        >
          <div className="pt-2 grid grid-cols-[150px_1fr]">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={name}
              onChange={(e) => handlerUserInput("name")(e)}
              className="py-[0.4rem] px-3 font-medium rounded-lg border-2 border-[#323232]/10"
            />
          </div>

          <div className="pt-4 grid grid-cols-[150px_1fr] border-t-2 border-t-[#323232]/10">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => handlerUserInput("email")(e)}
                className="w-full py-[0.4rem] pl-9 pr-2 font-medium rounded-lg border-2 border-[#323232]/10"
              />
              <span className="absolute left-0 top-0 bottom-0 flex items-center px-3 text-[#323232]/50">
                {mail}
              </span>
            </div>
          </div>
          <Link href={'/'} className="text-center bg-black hover:bg-yellow-500 text-white font-bold py-2 px-4 border border-blue-700 rounded">
               Back
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
