"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Mail, Calendar, Edit, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    bio: "Ainda não há informações de biografia.",
    phone: "",
  });
  
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "Ainda não há informações de biografia.",
        phone: user.phone || "",
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar no WordPress via API
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!",
      variant: "success",
    });
    setIsEditing(false);
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
                    alt={user.name || "Avatar"} 
                    fill
                    className="rounded-full object-cover border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-16 w-16 text-primary/60" />
                  </div>
                )}
              </div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Membro desde {new Date().toLocaleDateString()}</span>
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
              <div className="grid gap-3">
                <label className="text-sm font-medium" htmlFor="name">
                  Nome Completo
                </label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
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
                  placeholder="+244 XXX XXX XXX"
                />
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
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}