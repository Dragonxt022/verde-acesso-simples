import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import logoSvg from "@/assets/logo.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emailSchema = z.object({
  email: z.string().email("Email inválido"),
});

const cpfSchema = z.object({
  cpf: z.string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido")
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type CPFFormData = z.infer<typeof cpfSchema>;

const RecoverPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const cpfForm = useForm<CPFFormData>({
    resolver: zodResolver(cpfSchema),
    defaultValues: {
      cpf: "",
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

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Email de recuperação enviado!");
      setEmailSent(true);
    } catch (error) {
      toast.error("Erro ao enviar email. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCPFSubmit = async (data: CPFFormData) => {
    setIsLoading(true);
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Instruções de recuperação enviadas!");
      setEmailSent(true);
    } catch (error) {
      toast.error("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-verde-light/30 to-verde-accent/20">
        <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-verde-light shadow-lg">
          <CardHeader className="text-center">
            <div className="mb-4">
              <img 
                src={logoSvg} 
                alt="Logo" 
                className="h-16 w-auto mx-auto mb-4"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-verde-dark">Email Enviado!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-verde-light/20 rounded-lg">
                <Mail className="w-12 h-12 text-verde-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Se você não receber o email em alguns minutos, verifique sua pasta de spam.
                </p>
              </div>
              
              <Button
                asChild
                variant="outline"
                className="w-full border-verde-light hover:bg-verde-light/20"
              >
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-verde-light/30 to-verde-accent/20">
      <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-verde-light shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-4">
            <img 
              src={logoSvg} 
              alt="Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-verde-dark">Recuperar Senha</CardTitle>
          <CardDescription className="text-muted-foreground">
            Digite seu CPF ou email para receber instruções de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="cpf" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                CPF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recover-email">Email</Label>
                  <Input
                    id="recover-email"
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

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-verde-primary to-verde-secondary hover:from-verde-secondary hover:to-verde-primary transition-all duration-300 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Email de Recuperação"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="cpf">
              <form onSubmit={cpfForm.handleSubmit(handleCPFSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recover-cpf">CPF</Label>
                  <Input
                    id="recover-cpf"
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

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-verde-primary to-verde-secondary hover:from-verde-secondary hover:to-verde-primary transition-all duration-300 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Instruções"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button
              asChild
              variant="ghost"
              className="text-verde-accent hover:text-verde-primary hover:bg-verde-light/20 transition-colors duration-200"
            >
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecoverPassword;