import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[Sam Fitness ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '24px',
          padding: '40px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#0f172a',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px' }}>⚡</div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#475569', maxWidth: '400px', lineHeight: 1.6 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
            style={{
              padding: '12px 32px',
              background: '#0284c7',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
