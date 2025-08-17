interface LoginCredentials {
  identifier: string;
  password: string;
  type: 'cpf' | 'email';
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email?: string;
    cpf?: string;
  };
  message?: string;
}

class AuthService {
  private apiUrl: string;

  constructor(apiUrl: string = 'https://sua-api-laravel.com/api') {
    this.apiUrl = apiUrl;
  }

  setApiUrl(url: string) {
    this.apiUrl = url;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          [credentials.type]: credentials.identifier,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.token) {
        // Armazena o token no localStorage
        localStorage.setItem('auth_token', data.token);
        
        // Armazena dados do usuário
        if (data.user) {
          localStorage.setItem('user_data', JSON.stringify(data.user));
        }
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message || 'Login realizado com sucesso!',
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      
      if (token) {
        await fetch(`${this.apiUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Remove dados do localStorage independentemente do resultado da API
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUserData(): any | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Helper para fazer requisições autenticadas
  async authenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(options.headers || {}),
    };

    return fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers,
    });
  }
}

// Instância padrão do serviço
export const authService = new AuthService();

// Para configurar a URL da API
export const configureAuth = (apiUrl: string) => {
  authService.setApiUrl(apiUrl);
};

export type { LoginCredentials, AuthResponse };