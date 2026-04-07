"use client";

import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { Button } from "../ui/button";
import Image from 'next/image';
import { ChevronLeftIcon, MenuIcon } from 'lucide-react';
import { useSidebar } from "../ui/sidebar";
import CreatePost from '../post/CreatePost';

function Header() {
  const { user } = useUser();
  const { toggleSidebar, open, isMobile } = useSidebar();

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        {open ? (
          <ChevronLeftIcon
            onClick={toggleSidebar}
            className="w-6 h-6 cursor-pointer text-gray-900 dark:text-white"
          />
        ) : (
          <div className="flex items-center gap-2">
            <MenuIcon
              className="w-6 h-6 cursor-pointer text-gray-900 dark:text-white"
              onClick={toggleSidebar}
            />
            <Image
              src="/aphivehorizontal.png"
              alt="logo"
              width={150}
              height={150}
              className="w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52"
              priority
            />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <CreatePost />
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild variant="outline">
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
