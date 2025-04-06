import ConnexionForm from '@/features/auth/ConnexionForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <ConnexionForm isRegistered={true} />
    </main>
  );
}
