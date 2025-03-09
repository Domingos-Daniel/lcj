"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Mail, Calendar, Edit, Save, Phone, Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Facebook } from "lucide-react";

// Função para verificar a força da senha
function getPasswordStrength(password: string): { strength: number; feedback: string } {
  if (!password) return { strength: 0, feedback: "Insira uma senha" };

  let strength = 0;
  let feedback = "";

  // Cada critério adiciona um valor – o total máximo é limitado a 100
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  // Opcional: critério para caracteres especiais
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;

  strength = Math.min(strength, 100);

  if (strength < 25) {
    feedback = "Muito fraca";
  } else if (strength < 50) {
    feedback = "Fraca";
  } else if (strength < 75) {
    feedback = "Média";
  } else {
    feedback = "Forte";
  }

  return { strength, feedback };
}

export default function ProfilePage() {
  const { user, logout, loading, refreshUserData } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    phone: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, feedback: "" });
  const fullName = `${userData.firstName} ${userData.lastName}`.trim();

  // Carregar dados do usuário no estado
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(" ") : [""];
      setUserData({
        firstName: user.firstName || nameParts[0] || "",
        lastName: user.lastName || nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        bio: user.bio || "Ainda não há informações de biografia.",
        phone: user.phone || "",
        gender: user.gender || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      // Se não temos dados do usuário ainda, tentar atualizar
      refreshUserData();
    }
  }, [user, refreshUserData]);

  // Atualizar força da senha quando a nova senha muda
  useEffect(() => {
    setPasswordStrength(getPasswordStrength(userData.newPassword));
  }, [userData.newPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Se estiver alterando a senha, validar força e confirmação
    if (userData.newPassword) {
      if (passwordStrength.strength < 50) {
        toast({
          title: "Senha fraca",
          description: "Escolha uma senha mais forte (use letras maiúsculas, minúsculas, números e caracteres especiais).",
          variant: "destructive",
        });
        return false;
      }

      if (userData.newPassword !== userData.confirmPassword) {
        toast({
          title: "Senhas não coincidem",
          description: "A nova senha e a confirmação devem ser iguais.",
          variant: "destructive",
        });
        return false;
      }

      // Se o usuário não for OAuth, exigir a senha atual; 
      // caso contrário, não validar esse campo
      if (!user?.oauth && !userData.currentPassword) {
        toast({
          title: "Senha atual necessária",
          description: "Digite sua senha atual para confirmar as alterações.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validação de telefone permanece inalterada
    if (userData.phone && !/^\+?244[9][1-9]\d{7}$/.test(userData.phone.replace(/\s/g, ''))) {
      toast({
        title: "Telefone inválido",
        description: "Insira um número de telefone válido (ex: +244 9XX XXX XXX).",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const token = localStorage.getItem("wp_token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      // Usar token como parâmetro da URL
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/user/update&token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            gender: userData.gender,
            bio: userData.bio,
            current_password: user?.oauth ? undefined : userData.currentPassword,
            new_password: userData.newPassword || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta:", errorText);
        throw new Error(
          response.status === 401
            ? "Sessão expirada. Por favor, faça login novamente."
            : `Erro ao atualizar perfil (${response.status})`
        );
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso!",
          variant: "success",
        });

        // Limpar campos de senha
        setUserData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        // Recarregar dados do usuário
        refreshUserData();

        setIsEditing(false);
      } else {
        throw new Error(data.message || "Erro ao atualizar perfil");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getProgressColor = (strength: number) => {
    if (strength < 25) return "bg-red-500";
    if (strength < 50) return "bg-orange-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando perfil...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto relative w-32 h-32 mb-4">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={fullName || "Avatar"}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 128px"
                    className="rounded-full object-cover border-4 border-primary/20"
                    onError={(e) => {
                      // Fallback para default avatar se a imagem falhar
                      (e.target as HTMLImageElement).src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="text-4xl font-medium">
                      {user?.email?.charAt(0).toUpperCase() || user?.firstName?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>
              <CardTitle>{fullName || "Usuário"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Membro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
              {userData.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{userData.phone}</span>
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                {user?.oauth && (
                  <p className="flex items-center gap-1">
                    <span>Conectado via</span>
                    {user.oauth_provider === 'facebook' ? (
                      <>
                        <Facebook className="h-4 w-4" />
                        <span>Facebook</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          {/* SVG do Google reduzido */}
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                            fill="#4285F4"
                          />
                        </svg>
                        <span>Google</span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={logout} variant="outline" className="w-full">
                Sair da conta
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <CardDescription>Atualize suas informações pessoais</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <label className="text-sm font-medium" htmlFor="firstName">
                        Nome
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-3">
                      <label className="text-sm font-medium" htmlFor="lastName">
                        Sobrenome
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      type="email"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <label className="text-sm font-medium" htmlFor="gender">
                        Gênero
                      </label>
                      <Select
                        value={userData.gender}
                        onValueChange={(value) => handleSelectChange(value, "gender")}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefiro não informar</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <label className="text-sm font-medium" htmlFor="phone">
                        Telefone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        type="tel"
                        placeholder="+244 9XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <label className="text-sm font-medium" htmlFor="bio">
                      Biografia
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={userData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={5}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  {isEditing && (
                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          "Salvar Alterações"
                        )}
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Altere sua senha</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!user?.oauth && (
                    <div className="grid gap-3">
                      <label className="text-sm font-medium" htmlFor="currentPassword">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          value={userData.currentPassword}
                          onChange={handleChange}
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha atual"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3">
                    <label className="text-sm font-medium" htmlFor="newPassword">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        value={userData.newPassword}
                        onChange={handleChange}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Digite sua nova senha"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {userData.newPassword && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Força da senha</span>
                          <span className={
                            passwordStrength.strength < 25 ? "text-red-500" :
                              passwordStrength.strength < 50 ? "text-orange-500" :
                                passwordStrength.strength < 75 ? "text-yellow-500" :
                                  "text-green-500"
                          }>
                            {passwordStrength.feedback}
                          </span>
                        </div>
                        <Progress
                          value={passwordStrength.strength}
                          className={`h-1 ${getProgressColor(passwordStrength.strength)}`}
                        />
                        <ul className="text-xs space-y-1 text-muted-foreground mt-2">
                          <li className={/[A-Z]/.test(userData.newPassword) ? "text-green-500" : ""}>• Pelo menos uma letra maiúscula</li>
                          <li className={/[a-z]/.test(userData.newPassword) ? "text-green-500" : ""}>• Pelo menos uma letra minúscula</li>
                          <li className={/[0-9]/.test(userData.newPassword) ? "text-green-500" : ""}>• Pelo menos um número</li>
                          <li className={/[^A-Za-z0-9]/.test(userData.newPassword) ? "text-green-500" : ""}>• Pelo menos um caractere especial</li>
                          <li className={userData.newPassword.length >= 8 ? "text-green-500" : ""}>• Mínimo de 8 caracteres</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <label className="text-sm font-medium" htmlFor="confirmPassword">
                      Confirmar Nova Senha
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      type="password"
                      placeholder="Confirme sua nova senha"
                    />
                    {userData.newPassword && userData.confirmPassword && userData.newPassword !== userData.confirmPassword && (
                      <p className="text-xs text-red-500">
                        As senhas não coincidem
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSave}
                    className="w-full"
                    disabled={
                      isSaving ||
                      (userData.newPassword &&
                        (
                          passwordStrength.strength < 50 ||
                          userData.newPassword !== userData.confirmPassword ||
                          (!user?.oauth && !userData.currentPassword)
                        )
                      )
                    }
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : "Atualizar Senha"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>


    </div>
  );
}