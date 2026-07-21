"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-950 text-white min-h-[200px] border border-red-500/30 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-red-500">Something went wrong</h2>
          <p className="text-sm opacity-70 font-mono text-center">
            {this.state.error?.message || "An unexpected error occurred in this component."}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-white text-black font-bold uppercase text-xs hover:bg-neutral-200 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
