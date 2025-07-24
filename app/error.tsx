"use client";
import React from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">{error?.message || "Sorry, an unexpected error occurred."}</p>
        <button className="bg-red-600 text-white p-2 rounded hover:bg-red-700" onClick={() => reset()}>
          Try Again
        </button>
        <Link href="/" className="block mt-4 text-blue-600 underline">Go Home</Link>
      </div>
    </div>
  );
}
