import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ModalShell } from './ui/ModalShell';
import { SectionLabel } from './ui/SectionLabel';
import { WatercolorPanel } from './ui/WatercolorPanel';

type AuthMode = 'login' | 'signup';

interface AuthGateProps {
  isOpen: boolean;
  onAuthenticate: () => void;
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="thread-auth-gate__provider-logo">
      <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.74h3.24c1.9-1.75 2.98-4.32 2.98-7.75Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.74c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.83A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.68A6 6 0 0 1 6.1 12c0-.58.1-1.15.31-1.68V7.49H3.06A10 10 0 0 0 2 12c0 1.61.39 3.13 1.06 4.51l3.35-2.83Z" />
      <path fill="#EA4335" d="M12 6.2c1.47 0 2.78.5 3.82 1.5l2.87-2.87C16.96 3.22 14.7 2.2 12 2.2A10 10 0 0 0 3.06 7.49l3.35 2.83C7.2 7.96 9.4 6.2 12 6.2Z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="thread-auth-gate__provider-logo">
      <path
        fill="currentColor"
        d="M17.7 12.7c0-2.06 1.7-3.05 1.78-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.65 0-1.65-.73-2.71-.71-1.4.02-2.68.81-3.4 2.06-1.45 2.52-.37 6.25 1.04 8.29.69 1 1.52 2.12 2.6 2.08 1.04-.04 1.44-.67 2.7-.67 1.25 0 1.61.67 2.72.65 1.12-.02 1.84-1.02 2.53-2.02.79-1.16 1.12-2.28 1.14-2.34-.03-.01-2.18-.84-2.2-3.44ZM15.67 6.64c.57-.7.96-1.66.85-2.64-.82.03-1.81.55-2.4 1.24-.53.61-.99 1.6-.86 2.54.91.07 1.84-.46 2.41-1.14Z"
      />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="thread-auth-gate__provider-logo">
      <path fill="#F25022" d="M3 3h8.2v8.2H3z" />
      <path fill="#7FBA00" d="M12.8 3H21v8.2h-8.2z" />
      <path fill="#00A4EF" d="M3 12.8h8.2V21H3z" />
      <path fill="#FFB900" d="M12.8 12.8H21V21h-8.2z" />
    </svg>
  );
}

const providerOptions = [
  { label: 'Google', logo: <GoogleLogo /> },
  { label: 'Apple', logo: <AppleLogo /> },
  { label: 'Microsoft', logo: <MicrosoftLogo /> },
];

export default function AuthGate({ isOpen, onAuthenticate }: AuthGateProps) {
  const [mode, setMode] = useState<AuthMode>('login');

  const isSignup = mode === 'signup';

  return (
    <ModalShell
      isOpen={isOpen}
      titleId="auth-gate-title"
      maxWidthClassName="max-w-5xl"
      radiusClassName="thread-modal-panel--scalloped"
      panelClassName="thread-auth-gate"
      className="thread-auth-gate__overlay"
    >
      <WatercolorPanel className="thread-auth-gate__intro !p-4 md:!p-7">
        <div className="thread-auth-gate__brand">
          <img
            src="/threadline-logo-colored.svg"
            alt="Threadline"
            className="thread-auth-gate__brand-logo"
          />
        </div>
        <div className="thread-auth-gate__intro-copy">
          <SectionLabel>Private family workspace</SectionLabel>
          <h2>Gather key assessment information and keep next steps organised.</h2>
        </div>
      </WatercolorPanel>

      <section className="thread-auth-gate__panel" aria-labelledby="auth-gate-title">
        <div className="thread-auth-gate__heading">
          <div>
            <h1 id="auth-gate-title" className="thread-profile-heading thread-auth-gate__title">{isSignup ? 'Create your Threadline account' : 'Log in to Threadline'}</h1>
          </div>
        </div>

        <form
          className="thread-auth-gate__form"
          onSubmit={(event) => {
            event.preventDefault();
            onAuthenticate();
          }}
        >
          <label className="thread-auth-gate__field">
            <span>Email</span>
            <Input
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="thread-auth-gate__input"
            />
          </label>
          <label className="thread-auth-gate__field">
            <span>Password</span>
            <Input
              type="password"
              name="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder={isSignup ? 'Create a password' : 'Enter your password'}
              required
              className="thread-auth-gate__input"
            />
          </label>
          <Button type="submit" variant="forest" className="thread-auth-gate__submit" leftIcon={<Mail className="h-4 w-4" />}>
            {isSignup ? 'Create simulated account' : 'Log in with email'}
          </Button>
        </form>

        <div className="thread-auth-gate__divider">
          <span />
          <p>or continue with</p>
          <span />
        </div>

        <div className="thread-auth-gate__providers">
          {providerOptions.map((provider) => (
            <button
              key={provider.label}
              type="button"
              className="thread-auth-gate__provider"
              aria-label={`${isSignup ? 'Sign up' : 'Continue'} with ${provider.label}`}
              onClick={onAuthenticate}
            >
              <span className="thread-auth-gate__provider-mark">{provider.logo}</span>
              <span className="sr-only">{isSignup ? 'Sign up' : 'Continue'} with {provider.label}</span>
            </button>
          ))}
        </div>

        <p className="thread-auth-gate__account-prompt">
          <span>{isSignup ? 'Already have an account?' : "Don't have an account yet?"}</span>
          <button
            type="button"
            onClick={() => setMode(isSignup ? 'login' : 'signup')}
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>

        <button type="button" className="thread-auth-gate__demo-link" onClick={onAuthenticate}>
          Continue to demo without credentials
        </button>
      </section>
    </ModalShell>
  );
}
