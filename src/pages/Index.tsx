import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { authService, configureAuth } from "@/services/authService";
import { toast } from "sonner";
import heroImage from "@/assets/login-hero.jpg";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configure a URL da sua API Laravel aqui
    configureAuth('https://sua-api-laravel.com/api');
    
    // Verifica se o usuário já está autenticado
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const handleLogin = async (credentials: { identifier: string; password: string; type: 'cpf' | 'email' }) => {
    const result = await authService.login(credentials);
    
    if (result.success) {
      setIsAuthenticated(true);
      toast.success("Login realizado com sucesso!");
    } else {
      throw new Error(result.message || "Erro no login");
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    toast.info("Logout realizado com sucesso!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-verde-light to-verde-accent">
        <div className="text-verde-dark">Carregando...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    const userData = authService.getUserData();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-verde-light to-verde-accent">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-card rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-verde-dark mb-2">
                Bem-vindo ao Sistema!
              </h1>
              <p className="text-muted-foreground">
                Login realizado com sucesso.
              </p>
            </div>
            
            {userData && (
              <div className="bg-verde-light/50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-verde-dark mb-4">
                  Dados do Usuário:
                </h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> {userData.name}</p>
                  {userData.email && <p><strong>Email:</strong> {userData.email}</p>}
                  {userData.cpf && <p><strong>CPF:</strong> {userData.cpf}</p>}
                  <p><strong>ID:</strong> {userData.id}</p>
                </div>
              </div>
            )}
            
            <div className="text-center">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-secondary to-verde-primary text-white px-6 py-2 rounded-lg hover:from-verde-primary hover:to-verde-secondary transition-all duration-300 shadow-md"
              >
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Hero Section - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-verde-dark/80 to-verde-primary/60" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Acesso Seguro
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Sistema de autenticação moderno e confiável para o seu acesso.
            </p>
            <div className="space-y-4 text-sm opacity-80">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-verde-accent rounded-full" />
                <span>Login com CPF ou Email</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-verde-accent rounded-full" />
                <span>Interface Responsiva</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-verde-accent rounded-full" />
                <span>Segurança Avançada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-verde-light/30 to-verde-accent/20">
        <div className="w-full max-w-md">
          {/* Mobile Hero */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-verde-dark mb-2">
              Acesso Seguro
            </h1>
            <p className="text-muted-foreground">
              Entre com suas credenciais para continuar
            </p>
          </div>
          
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Index;
