import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-verde-light/30 to-verde-accent/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-verde-primary/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-verde-accent/10 rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="text-center relative z-10 animate-fade-in">
        <div className="mb-8 animate-bounce-in">
          <div className="w-32 h-32 bg-verde-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 hover-scale hover-glow">
            <span className="text-6xl font-bold text-verde-primary animate-pulse">404</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-verde-dark animate-slide-up">Página não encontrada</h1>
        <p className="text-xl text-muted-foreground mb-8 animate-slide-up [animation-delay:0.1s]">
          Oops! A página que você procura não existe.
        </p>
        
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-verde-primary to-verde-secondary text-white rounded-lg hover:from-verde-secondary hover:to-verde-primary transition-all duration-300 shadow-md btn-glow hover-lift link-underline animate-fade-in [animation-delay:0.3s]"
        >
          <svg className="w-4 h-4 hover-rotate transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
