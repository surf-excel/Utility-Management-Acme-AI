import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
  },
});

class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message?: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Runtime error in React tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0c14] flex flex-col items-center justify-center text-white p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4" />
          <p className="text-slate-300 mb-2">The Utility Dashboard hit an unexpected error.</p>
          {this.state.message && (
            <p className="text-xs text-red-400 max-w-md text-center break-words">{this.state.message}</p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>
);
