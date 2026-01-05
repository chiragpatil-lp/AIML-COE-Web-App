"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createUserPermissions } from "@/lib/firebase/user-management";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PILLAR_NAMES: Record<string, string> = {
  pillar1: "Strategy & Value Realization",
  pillar2: "Innovation & IP Development",
  pillar3: "Platforms & Engineering",
  pillar4: "People & Capability Enablement",
  pillar5: "COE Delivery Governance",
  pillar6: "Communication & Market Intelligence",
};

export function AddUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddUserDialogProps) {
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [pillars, setPillars] = useState({
    pillar1: false,
    pillar2: false,
    pillar3: false,
    pillar4: false,
    pillar5: false,
    pillar6: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handlePillarToggle = (pillarKey: keyof typeof pillars) => {
    setPillars((prev) => ({
      ...prev,
      [pillarKey]: !prev[pillarKey],
    }));
  };

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    // Validate email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter an email address");
      return;
    }

    if (!isEmailValid(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSaving(true);
    try {
      await createUserPermissions(trimmedEmail, {
        isAdmin,
        pillars,
      });

      toast.success(
        `User ${trimmedEmail} added successfully. They will have access when they sign in.`
      );
      
      // Reset form
      setEmail("");
      setIsAdmin(false);
      setPillars({
        pillar1: false,
        pillar2: false,
        pillar3: false,
        pillar4: false,
        pillar5: false,
        pillar6: false,
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Failed to add user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setEmail("");
      setIsAdmin(false);
      setPillars({
        pillar1: false,
        pillar2: false,
        pillar3: false,
        pillar4: false,
        pillar5: false,
        pillar6: false,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle
            className="text-2xl"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Add New User
          </DialogTitle>
          <DialogDescription
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Pre-authorize a user by email address. They will have access when they
            sign in for the first time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="user-email"
              className="text-sm font-medium text-[#111A4A] block"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              Email Address *
            </label>
            <input
              id="user-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#146e96] focus:border-transparent"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
              disabled={isSaving}
            />
            <p
              className="text-xs text-[#111A4A] opacity-60"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              The user will need to sign in with this exact email address
            </p>
          </div>

          {/* Admin Access */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#146e96]/5 to-transparent border border-[#146e96]/10 rounded-lg">
              <div className="flex-1">
                <label
                  htmlFor="admin-toggle-add"
                  className="text-base font-semibold text-[#111A4A] block mb-1 cursor-pointer"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  Administrator Access
                </label>
                <p
                  className="text-sm text-[#111A4A] opacity-60"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  Grants full access to all pillars and admin features
                </p>
              </div>
              <Switch
                id="admin-toggle-add"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="toggle-primary"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Pillar Access */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold text-[#111A4A]"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              Pillar Access
            </h3>
            <p
              className="text-sm text-[#111A4A] opacity-60"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              {isAdmin
                ? "Admin users automatically have access to all pillars"
                : "Select which pillars this user can access"}
            </p>

            <div className="space-y-2">
              {Object.entries(PILLAR_NAMES).map(([key, name]) => {
                const pillarKey = key as keyof typeof pillars;
                const pillarNumber = parseInt(key.replace("pillar", ""));
                const isEnabled = isAdmin || pillars[pillarKey];

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isAdmin
                        ? "bg-gray-50 border-gray-200 opacity-60"
                        : "bg-white border-gray-200 hover:border-[#146e96]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          backgroundColor:
                            pillarNumber % 2 === 1 ? "#f2545b" : "#2c3e50",
                          fontFamily:
                            "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        }}
                      >
                        {pillarNumber}
                      </div>
                      <label
                        htmlFor={`pillar-add-${pillarNumber}`}
                        className="text-sm font-medium text-[#111A4A] cursor-pointer"
                        style={{
                          fontFamily:
                            "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        }}
                      >
                        {name}
                      </label>
                    </div>
                    <Switch
                      id={`pillar-add-${pillarNumber}`}
                      checked={isEnabled}
                      onChange={() => handlePillarToggle(pillarKey)}
                      disabled={isAdmin || isSaving}
                      className={isEnabled ? "toggle-primary" : ""}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-blue-600 shrink-0 w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p
              className="text-sm text-blue-900"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              The user won't receive an email notification. Share the sign-in link
              with them directly.
            </p>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="border border-gray-300 text-[#111A4A] px-6 py-2.5 rounded-full text-base font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !email.trim()}
            className="bg-[#146e96] text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-[#146e96]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            {isSaving && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {isSaving ? "Adding User..." : "Add User"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

