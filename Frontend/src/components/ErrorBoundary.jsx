import React, { Component } from "react";

/**
 * ============================================================================
 *  ErrorBoundary Component
 * ============================================================================
 * Purpose:
 *   - Catches JavaScript errors in child components
 *   - Logs error details for debugging
 *   - Displays fallback UI so the whole app doesn't crash
 *
 * Usage:
 *   <ErrorBoundary>
 *     <MyComponent />
 *   </ErrorBoundary>
 *
 * ============================================================================
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // Updates state so next render shows fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Logs error details for debugging
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  // Reload page handler
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
            <h1 className="text-xl font-bold text-red-600 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>

            {/* Optional: Show detailed error info in development */}
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <pre className="bg-gray-200 text-left p-2 rounded text-xs overflow-auto max-h-40 mb-4">
                {this.state.errorInfo.componentStack}
              </pre>
            )}

            <button
              onClick={this.handleReload}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
