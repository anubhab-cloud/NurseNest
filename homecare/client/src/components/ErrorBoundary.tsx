import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter, sans-serif', background: '#F8FAFC', padding: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 8, maxWidth: 480 }}>
            {this.state.error.message}
          </p>
          <pre style={{
            fontSize: 11, color: '#94A3B8', background: '#F1F5F9',
            padding: '10px 16px', borderRadius: 8, maxWidth: 600,
            overflowX: 'auto', marginBottom: 24, textAlign: 'left',
          }}>
            {this.state.error.stack?.split('\n').slice(0, 5).join('\n')}
          </pre>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            style={{
              background: '#2563EB', color: '#fff', border: 'none',
              padding: '10px 24px', borderRadius: 10, fontWeight: 600,
              fontSize: 14, cursor: 'pointer',
            }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
