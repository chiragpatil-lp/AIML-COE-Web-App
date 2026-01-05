"use client";

import { useState, useEffect } from "react";
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
import { updateUserPermissions } from "@/lib/firebase/user-management";
import type { UserPermissions } from "@/lib/types/auth.types";

interface EditUserPermissionsDialogProps {
  user: UserPermissions | null;
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

export function EditUserPermissionsDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: EditUserPermissionsDialogProps) {
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

  // Update state when user changes
  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin);
      setPillars(user.pillars);
    }
  }, [user]);

  const handlePillarToggle = (pillarKey: keyof typeof pillars) => {
    setPillars((prev) => ({
      ...prev,
      [pillarKey]: !prev[pillarKey],
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateUserPermissions(user.userId, {
        isAdmin,
        pillars,
      });

      toast.success("User permissions updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update user permissions:", error);
      toast.error("Failed to update permissions. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            Edit User Permissions
          </DialogTitle>
          <DialogDescription
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Manage access levels for {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium text-[#111A4A]"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  Email:
                </span>
                <span
                  className="text-sm text-[#111A4A] opacity-60"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium text-[#111A4A]"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  User ID:
                </span>
                <span
                  className="text-sm text-[#111A4A] opacity-60 font-mono"
                  style={{
                    fontFamily: "monospace",
                  }}
                >
                  {user.userId.substring(0, 12)}...
                </span>
              </div>
            </div>
          </div>

          {/* Admin Access */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#146e96]/5 to-transparent border border-[#146e96]/10 rounded-lg">
              <div className="flex-1">
                <label
                  htmlFor="admin-toggle"
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
                id="admin-toggle"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="toggle-primary"
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
                        htmlFor={`pillar-${pillarNumber}`}
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
                      id={`pillar-${pillarNumber}`}
                      checked={isEnabled}
                      onChange={() => handlePillarToggle(pillarKey)}
                      disabled={isAdmin}
                      className={isEnabled ? "toggle-primary" : ""}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
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
            disabled={isSaving}
            className="bg-[#146e96] text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-[#146e96]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            {isSaving && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

