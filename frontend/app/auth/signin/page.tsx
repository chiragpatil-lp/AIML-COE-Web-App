import { SignInButton } from "@/components/auth/SignInButton";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold mb-4 text-[#202020]"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              fontWeight: "500",
            }}
          >
            AIML COE
          </h1>
          <p
            className="text-lg text-[#404040]"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Sign in to access the Center of Excellence platform
          </p>
        </div>

        <div className="bg-[#e9e9e9] rounded-[40px] p-12 shadow-xl">
          <h2
            className="text-2xl mb-4 text-center text-[#202020]"
            style={{
              fontWeight: "500",
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Welcome
          </h2>
          <p
            className="text-center text-[#404040] mb-6"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Use your Google account to sign in
          </p>
          <SignInButton />
        </div>

        <div className="text-center mt-6 text-sm text-[#404040]">
          <p style={{ fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans" }}>
            By signing in, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
}
