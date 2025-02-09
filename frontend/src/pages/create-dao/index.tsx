// @ts-nocheck comment
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ExistingTokenForm from "@/components/ExistingTokenForm/ExistingTokenForm";
import NewTokenForm from "@/components/NewTokenForm/NewTokenForm";

const CreateDao = () => {
  const [existingToken, setIsExistingToken] = useState(false);
  const [newToken, setNewToken] = useState(false);
  const [showBtn, setShowBtn] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto">
        {showBtn && (
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <Image
                src="/assets/tokens.webp"
                alt="Tokens Image"
                width={275}
                height={275}
                className="rounded-lg object-contain w-[275px] md:w-[300px]"
              />
            </div>
            <div className="w-full md:w-2/3 max-w-2xl flex flex-col space-y-4">
              <Button
                variant="default"
                className="w-full h-24 p-4 text-xl font-bold transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-102 active:scale-98"
                onClick={() => {
                  setIsExistingToken(!existingToken);
                  setShowBtn(false);
                }}
              >
                Import Existing Token
              </Button>
              <Button
                variant="default"
                className="w-full h-24 p-4 text-xl font-bold transition-all duration-300 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-102 active:scale-98"
                onClick={() => {
                  setNewToken(!newToken);
                  setShowBtn(false);
                }}
              >
                Create a new Token
              </Button>
            </div>
          </div>
        )}
        {existingToken && <ExistingTokenForm />}
        {newToken && <NewTokenForm />}
      </div>
    </div>
  );
};

export default CreateDao;
