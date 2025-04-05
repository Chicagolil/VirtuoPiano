import LoginForm from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4 text-center">Connexion</h1>
        <LoginForm />
      </div>
    </main>
  );
}
