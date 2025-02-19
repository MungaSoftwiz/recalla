import { SignIn } from '@/components/Auth/SignIn';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0B2E] to-[#392064] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}