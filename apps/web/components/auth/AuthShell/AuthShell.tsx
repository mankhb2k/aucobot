import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] rounded-lg border border-border bg-white p-8 shadow-md">
        <p className="mb-6 text-center text-xl font-bold tracking-tight text-text">
          Aucobot
        </p>
        {children}
      </div>
    </div>
  );
}
