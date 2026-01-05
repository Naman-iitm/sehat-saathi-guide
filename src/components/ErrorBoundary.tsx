import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-2xl font-bold mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-4">
            The app encountered an unexpected error. Please try again.
          </p>
          <Button onClick={this.handleReload}>
            Reload App
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
