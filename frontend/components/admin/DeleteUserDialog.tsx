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
import { toast } from "sonner";
import { deleteUser } from "@/lib/firebase/user-management";
import type { UserPermissions } from "@/lib/types/auth.types";

interface DeleteUserDialogProps {
  user: UserPermissions | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const isConfirmationValid = confirmationText === "DELETE";

  const handleDelete = async () => {
    if (!user) {
      toast.error("No user selected");
      return;
    }

    if (!isConfirmationValid) {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);

    try {
      await deleteUser(user.userId);

      toast.success(
        `User ${user.email} has been permanently deleted from the system`,
      );

      // Reset form
      setConfirmationText("");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete user";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmationText("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" showCloseButton={!isDeleting}>
        <DialogHeader>
          <DialogTitle
            className="text-2xl text-red-600"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Delete User
          </DialogTitle>
          <DialogDescription
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            This action cannot be undone. This will permanently delete the user
            account.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-4 py-4">
            {/* User Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                <div>
                  <span
                    className="text-sm font-medium text-gray-600"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    }}
                  >
                    Email:
                  </span>
                  <p
                    className="text-base font-semibold text-gray-900"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    }}
                  >
                    {user.email}
                  </p>
                </div>
                {user.isAdmin && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      Admin
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-red-600 shrink-0 w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div
                className="text-sm text-red-900"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                <p className="font-semibold mb-1">This will:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Remove the user from Firebase Authentication</li>
                  <li>Delete all user permissions from the database</li>
                  <li>Prevent the user from signing in</li>
                  <li>Cannot be undone</li>
                </ul>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <label
                htmlFor="confirmation-input"
                className="text-sm font-medium text-gray-900 block"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Type <span className="font-bold text-red-600">DELETE</span> to
                confirm:
              </label>
              <input
                id="confirmation-input"
                type="text"
                placeholder="DELETE"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
                disabled={isDeleting}
                autoComplete="off"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="border border-gray-300 text-[#111A4A] px-6 py-2.5 rounded-full text-base font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || !isConfirmationValid}
            className="bg-red-600 text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            {isDeleting && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
