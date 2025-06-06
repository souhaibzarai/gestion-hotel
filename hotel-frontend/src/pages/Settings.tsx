import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { fetchSettings, updateSettings } from '@/services/api';

const Settings = () => {
  const { isAdmin } = useAuth();

  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelEmail, setHotelEmail] = useState('');
  const [hotelPhone, setHotelPhone] = useState('');

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoCheckout, setAutoCheckout] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSettings();
        setHotelName(data.hotel_name || '');
        setHotelAddress(data.hotel_address || '');
        setHotelEmail(data.hotel_email || '');
        setHotelPhone(data.hotel_phone || '');
        setEmailNotifications(data.email_notifications === '1');
        setSmsNotifications(data.sms_notifications === '1');
        setAutoCheckout(data.auto_checkout === '1');
      } catch {
        toast.error("Impossible de charger les paramètres");
      }
    };
    load();
  }, []);

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

  const saveHotelInfo = async () => {
    try {
      await updateSettings({
        hotel_name: hotelName,
        hotel_address: hotelAddress,
        hotel_email: hotelEmail,
        hotel_phone: hotelPhone,
      });
      toast.success("Informations de l'hôtel mises à jour");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const saveSystemSettings = async () => {
    try {
      await updateSettings({
        email_notifications: emailNotifications ? 1 : 0,
        sms_notifications: smsNotifications ? 1 : 0,
        auto_checkout: autoCheckout ? 1 : 0,
      });
      toast.success("Paramètres système mis à jour");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
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
              <Input id="hotel-name" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="hotel-address">Adresse</Label>
              <Input id="hotel-address" value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="hotel-email">Email</Label>
                <Input id="hotel-email" type="email" value={hotelEmail} onChange={(e) => setHotelEmail(e.target.value)} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="hotel-phone">Téléphone</Label>
                <Input id="hotel-phone" value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} />
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
                <p className="text-muted-foreground text-sm">Envoyer des emails aux clients</p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                <p className="text-muted-foreground text-sm">Envoyer des SMS aux clients</p>
              </div>
              <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-checkout">Checkout automatique</Label>
                <p className="text-muted-foreground text-sm">Libérer automatiquement les chambres</p>
              </div>
              <Switch id="auto-checkout" checked={autoCheckout} onCheckedChange={setAutoCheckout} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSystemSettings}>Enregistrer</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
