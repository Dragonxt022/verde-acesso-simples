import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Shield, Mail } from "lucide-react";

const cpfSchema = z.object({
  cpf: z.string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido")
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const emailSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type CPFFormData = z.infer<typeof cpfSchema>;
type EmailFormData = z.infer<typeof emailSchema>;

interface LoginFormProps {
  onLogin: (credentials: { identifier: string; password: string; type: 'cpf' | 'email' }) => Promise<void>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cpfForm = useForm<CPFFormData>({
    resolver: zodResolver(cpfSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formatCPF = (value: string) => {
    const cpf = value.replace(/\D/g, "");
    return cpf
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleCPFSubmit = async (data: CPFFormData) => {
    setIsLoading(true);
    try {
      await onLogin({
        identifier: data.cpf.replace(/\D/g, ""),
        password: data.password,
        type: 'cpf'
      });
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Erro no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      await onLogin({
        identifier: data.email,
        password: data.password,
        type: 'email'
      });
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Erro no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-verde-light shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-verde-dark">Acesso ao Sistema</CardTitle>
        <CardDescription className="text-muted-foreground">
          Entre com seu CPF ou email para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cpf" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="cpf" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              CPF
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cpf">
            <form onSubmit={cpfForm.handleSubmit(handleCPFSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  {...cpfForm.register("cpf")}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    e.target.value = formatted;
                    cpfForm.setValue("cpf", formatted);
                  }}
                  className="focus:ring-verde-primary focus:border-verde-primary"
                />
                {cpfForm.formState.errors.cpf && (
                  <p className="text-sm text-destructive">
                    {cpfForm.formState.errors.cpf.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="cpf-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    {...cpfForm.register("password")}
                    className="focus:ring-verde-primary focus:border-verde-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {cpfForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {cpfForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-verde-primary to-verde-secondary hover:from-verde-secondary hover:to-verde-primary transition-all duration-300 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar com CPF"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="email">
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...emailForm.register("email")}
                  className="focus:ring-verde-primary focus:border-verde-primary"
                />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="email-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    {...emailForm.register("password")}
                    className="focus:ring-verde-primary focus:border-verde-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {emailForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {emailForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-verde-primary to-verde-secondary hover:from-verde-secondary hover:to-verde-primary transition-all duration-300 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar com Email"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <a 
            href="#" 
            className="text-sm text-verde-accent hover:text-verde-primary transition-colors duration-200"
          >
            Esqueceu sua senha?
          </a>
        </div>
      </CardContent>
    </Card>
  );
}