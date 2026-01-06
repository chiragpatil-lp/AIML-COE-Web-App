"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/config";

export default function MigratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!functions) {
        throw new Error("Cloud Functions not initialized");
      }

      const migrateFunction = httpsCallable(
        functions,
        "migrateEmailPermissionsToUid",
      );
      const response = await migrateFunction({});

      console.log("Migration response:", response);
      setResult(response.data);
    } catch (err: any) {
      console.error("Migration error:", err);
      setError(err.message || "Migration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-4">
              Migrate Permissions Data
            </h1>

            <div className="alert alert-info mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h3 className="font-bold">One-time Migration</h3>
                <div className="text-sm">
                  This will migrate all email-based permission documents to
                  UID-based documents. Run this once to fix the authentication
                  issue.
                </div>
              </div>
            </div>

            <button
              onClick={runMigration}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Running Migration...
                </>
              ) : (
                "Run Migration"
              )}
            </button>

            {error && (
              <div className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="mt-4">
                <div className="alert alert-success mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Migration completed successfully!</span>
                </div>

                <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-4">
                  <div className="stat">
                    <div className="stat-title">Migrated</div>
                    <div className="stat-value text-success">
                      {result.results?.migrated?.length || 0}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Skipped</div>
                    <div className="stat-value">
                      {result.results?.skipped?.length || 0}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Errors</div>
                    <div className="stat-value text-error">
                      {result.results?.errors?.length || 0}
                    </div>
                  </div>
                </div>

                {result.results?.migrated?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Migrated Documents:</h3>
                    <ul className="list-disc list-inside">
                      {result.results.migrated.map(
                        (item: string, idx: number) => (
                          <li key={idx} className="text-sm">
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {result.results?.skipped?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Skipped Documents:</h3>
                    <ul className="list-disc list-inside">
                      {result.results.skipped.map(
                        (item: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600">
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {result.results?.errors?.length > 0 && (
                  <div className="alert alert-warning">
                    <h3 className="font-bold mb-2">Errors:</h3>
                    <ul className="list-disc list-inside">
                      {result.results.errors.map(
                        (item: string, idx: number) => (
                          <li key={idx} className="text-sm">
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <a href="/dashboard" className="btn btn-outline">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
