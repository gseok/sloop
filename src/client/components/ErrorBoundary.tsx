import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true,
      error,
      // eslint-disable-next-line react/no-unused-state
      errorInfo,
    });
  }

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;
    if (hasError && error) {
      return <>{error.message}</>;
    }
    return children;
  }
}

export default ErrorBoundary;
