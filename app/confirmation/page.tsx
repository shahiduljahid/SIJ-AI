"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";

export default function EmailConfirmation() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setCooldownSeconds((currentSeconds) => Math.max(0, currentSeconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);
  
  const handleResendEmail = async () => {
    if (isSubmitting || cooldownSeconds > 0) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const client = createSupabaseClient();
      const { error } = await client.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        if (error.message.toLowerCase().includes("rate limit")) {
          setError("Supabase has throttled verification emails for this address. Wait a few minutes before trying again.");
          setCooldownSeconds(300);
        } else {
          setError(error.message);
        }
      } else {
        setCooldownSeconds(60);
      }
    } catch {
      setError("Failed to resend verification email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6 mx-auto -mt-16">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-normal tracking-tight">Check your inbox</h1>
          <p className="mt-4 text-gray-600">
            We sent a confirmation email to<br />
            <span className="font-medium text-black">{email}</span>
          </p>
          <p className="mt-2 text-gray-600">
            Click the link in the email to confirm your account
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {cooldownSeconds > 0 && (
            <div className="text-gray-500 text-sm text-center">
              You can request another email in {Math.ceil(cooldownSeconds / 60)} minute(s).
            </div>
          )}

          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isSubmitting || cooldownSeconds > 0}
            className="w-full text-center text-zinc-900 hover:underline text-sm font-normal"
          >
            {cooldownSeconds > 0 ? "Please wait before sending again" : "Didn&apos;t receive an email? Send again"}
          </button>
        </div>
      </div>
    </div>
  );
} 