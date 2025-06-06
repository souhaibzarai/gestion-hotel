
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, User, Key } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="flex flex-col max-w-md w-full">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-primary rounded-full p-3 mb-4">
            <Hotel className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-center">Gestion D'hotel</h1>
          <p className="text-muted-foreground text-center mt-2">Système de gestion hôtelière</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder au système
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Démo: admin@admin.com / admin
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Mot de passe"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Réceptionniste: receptionist@hotel.com / reception
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
