"use client";

import { useState, useRef } from "react";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { useToast } from "@/components/ui/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Icons } from "@/components/ui/Icons";

// Import your ABI and contract address
import daomanagerabi from "@/utils/abi/daoManager.json";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const output = await lighthouse.upload(
        file,
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!,
        false,
        null,
        progressCallback
      );
      console.log("File Status:", output);
      setIpfsUrl(output.data.Hash);
      toast({
        title: "Image Uploaded",
        description: "Your profile image has been uploaded to IPFS.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
          daomanagerabi,
          signer
        );
        const accounts = await provider.listAccounts();
        const tx = await contract.createUser(
          name,
          email,
          bio,
          ipfsUrl,
          accounts[0]
        );
        await tx.wait();
        toast({
          title: "Registration Successful",
          description: "Welcome to our platform!",
        });
      } else {
        throw new Error("Ethereum provider not found");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Registration Failed",
        description:
          "There was an error during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Join Now! 🎯
          </CardTitle>
          <CardDescription className="text-center">
            Create your account and start your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">User Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-32"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-image">Profile Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  onChange={(e) => uploadFile(e.target.files)}
                  type="file"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Choose File
                </Button>
                {ipfsUrl && (
                  <span className="text-sm text-muted-foreground">
                    File uploaded successfully
                  </span>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
