

import  { Component, ErrorInfo, ReactNode } from "react";

// Define the types for props and state of the ErrorBoundary component
interface ErrorBoundaryProps {
  children: ReactNode; // Children props is what is being wrapped inside the boundary
}

interface ErrorBoundaryState {
  hasError: boolean; // Flag to check if error is encountered
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // This lifecycle method is triggered when an error is caught
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  // This lifecycle method provides error info for further investigation
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo,
    });
    // Optionally log error to an external service like Sentry or LogRocket
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Customize fallback UI for errors here
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }

    // If no error, render the children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
