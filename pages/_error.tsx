import React from 'react';
import Link from 'next/link';

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
        <h1 className="text-3xl font-bold mb-4">{statusCode ? `Error ${statusCode}` : 'An error occurred'}</h1>
        <p className="mb-4">Sorry, something went wrong. Please try refreshing the page or contact support.</p>
        <Link href="/" className="btn">Go Home</Link>
      </div>
    </div>
  );
}

type ErrorInitialProps = {
  res?: { statusCode?: number };
  err?: { statusCode?: number };
};
Error.getInitialProps = ({ res, err }: ErrorInitialProps) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default Error;

