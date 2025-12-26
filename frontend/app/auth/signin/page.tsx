import { SignInButton } from '@/components/auth/SignInButton';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AIML COE
          </h1>
          <p className="text-lg text-base-content/70">
            Sign in to access the Center of Excellence platform
          </p>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4 justify-center">Welcome</h2>
            <p className="text-center text-base-content/60 mb-6">
              Use your Google account to sign in
            </p>
            <SignInButton />
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-base-content/50">
          <p>By signing in, you agree to our terms of service</p>
        </div>
      </div>
    </div>
  );
}
