
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { isAdmin } = useAuth();
  const [hotelName, setHotelName] = useState("Hôtel Example");
  const [hotelAddress, setHotelAddress] = useState("123 Avenue des Champs-Élysées, 75008 Paris");
  const [hotelEmail, setHotelEmail] = useState("contact@hotelexample.com");
  const [hotelPhone, setHotelPhone] = useState("+33 1 23 45 67 89");
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoCheckout, setAutoCheckout] = useState(true);
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Accès interdit</h2>
          <p className="text-muted-foreground">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  const saveHotelInfo = () => {
    // In a real app, this would save the data to the server
    toast.success("Informations de l'hôtel mises à jour");
  };
  
  const saveSystemSettings = () => {
    // In a real app, this would save the system settings to the server
    toast.success("Paramètres système mis à jour");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les configurations et paramètres du système</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'hôtel</CardTitle>
          <CardDescription>
            Ces informations apparaîtront sur les factures et documents officiels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="hotel-name">Nom de l'hôtel</Label>
              <Input
                id="hotel-name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="hotel-address">Adresse</Label>
              <Input
                id="hotel-address"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="hotel-email">Email</Label>
                <Input
                  id="hotel-email"
                  type="email"
                  value={hotelEmail}
                  onChange={(e) => setHotelEmail(e.target.value)}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="hotel-phone">Téléphone</Label>
                <Input
                  id="hotel-phone"
                  value={hotelPhone}
                  onChange={(e) => setHotelPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveHotelInfo}>Enregistrer</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Paramètres système</CardTitle>
          <CardDescription>
            Configurez les comportements automatiques et notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <p className="text-muted-foreground text-sm">
                  Envoyer des emails aux clients pour les confirmations et rappels
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                <p className="text-muted-foreground text-sm">
                  Envoyer des SMS aux clients pour les confirmations et rappels
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-checkout">Checkout automatique</Label>
                <p className="text-muted-foreground text-sm">
                  Libérer automatiquement les chambres à l'heure de départ prévue
                </p>
              </div>
              <Switch
                id="auto-checkout"
                checked={autoCheckout}
                onCheckedChange={setAutoCheckout}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSystemSettings}>Enregistrer</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Gérez les comptes du personnel ayant accès au système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-muted rounded-md">
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-muted-foreground">admin@hotel.com</p>
                <p className="text-xs text-primary">Administrateur</p>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-md">
              <div>
                <p className="font-medium">Receptionist User</p>
                <p className="text-sm text-muted-foreground">receptionist@hotel.com</p>
                <p className="text-xs text-primary">Réceptionniste</p>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">
            Ajouter un utilisateur
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
