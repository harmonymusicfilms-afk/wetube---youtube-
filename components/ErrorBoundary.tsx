
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from './Icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4">
          <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6 text-sm">
              We're sorry, but an unexpected error occurred. Please try refreshing the page.
            </p>
            
            {this.state.error && (
              <div className="bg-[#121212] rounded-lg p-4 mb-6 text-left overflow-auto max-h-32 border border-[#303030]">
                <p className="text-red-400 font-mono text-xs break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button 
              onClick={() => window.location.reload()}
              className="bg-wetube-red hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg w-full transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
