/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  fetchSettings,
  updateSettings,
  fetchUsers,
  deleteUser,
  createUser,
  updateUser,
} from '@/services/api';
import type { User, UserPayload } from '@/models/User';
import { ApiValidationError } from '@/services/ApiValidationError';

const Settings = () => {
  const { isAdmin, user: currentUser } = useAuth();

  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelEmail, setHotelEmail] = useState('');
  const [hotelPhone, setHotelPhone] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoCheckout, setAutoCheckout] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<UserPayload>({ name: '', email: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await fetchSettings();
        setHotelName(settings.hotel_name || '');
        setHotelAddress(settings.hotel_address || '');
        setHotelEmail(settings.hotel_email || '');
        setHotelPhone(settings.hotel_phone || '');
        setEmailNotifications(settings.email_notifications === '1');
        setSmsNotifications(settings.sms_notifications === '1');
        setAutoCheckout(settings.auto_checkout === '1');
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch {
        toast.error("Erreur lors du chargement des données");
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
      toast.success("Informations mises à jour");
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

  const handleEdit = (user: User) => {
    setMode('edit');
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleDelete = async (user: User) => {
    if (user.email === 'admin@admin.com') {
      return toast.error("Impossible de supprimer l'administrateur principal");
    }
    if (currentUser?.id === user.id) {
      return toast.error("Vous ne pouvez pas supprimer votre propre compte");
    }
    if (confirm(`Supprimer ${user.name} ?`)) {
      try {
        await deleteUser(user.id);
        setUsers(users.filter((u) => u.id !== user.id));
        toast.success("Utilisateur supprimé");
      } catch (e: any) {
        toast.error(e.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (mode === 'edit' && editingUser) {
        await updateUser(editingUser.id, form);
        toast.success("Utilisateur mis à jour");
      } else {
        await createUser(form);
        toast.success("Utilisateur ajouté");
      }
      const updated = await fetchUsers();
      setUsers(updated);
      setOpenModal(false);
      setEditingUser(null);
      setForm({ name: '', email: '', password: '', role: 'user' });
    } catch (e: any) {
      if (e.details) {
        Object.entries(e.details).forEach(([field, messages]) =>
          messages.forEach((msg) => toast.error(`${field}: ${msg}`))
        );
      } else {
        toast.error(e.message || "Erreur serveur");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Configuration générale du système</p>
      </div>

      {/* Hotel Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'hôtel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Nom</Label>
          <Input value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
          <Label>Adresse</Label>
          <Input value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={hotelEmail} onChange={(e) => setHotelEmail(e.target.value)} />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveHotelInfo}>Enregistrer</Button>
        </CardFooter>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Notifications Email</Label>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Notifications SMS</Label>
            <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Checkout Automatique</Label>
            <Switch checked={autoCheckout} onCheckedChange={setAutoCheckout} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSystemSettings}>Enregistrer</Button>
        </CardFooter>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-muted p-4 rounded">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs capitalize">{user.role}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>Modifier</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(user)}>Supprimer</Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => {
              setMode('add');
              setForm({ name: '', email: '', password: '', role: 'user' });
              setOpenModal(true);
            }}
          >
            Ajouter un utilisateur
          </Button>
        </CardFooter>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'edit' ? "Modifier" : "Ajouter"} un utilisateur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={editingUser?.email === 'admin@admin.com'}
              />
            </div>
            <div>
              <Label>Mot de passe</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={mode === 'edit' ? 'Laisser vide pour conserver' : ''}
              />
            </div>
            <div>
              <Label>Rôle</Label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'user' })}
                disabled={editingUser?.email === 'admin@admin.com'}
                className="w-full border rounded h-10 px-2"
              >
                <option value="admin">Administrateur</option>
                <option value="user">Utilisateur</option>
              </select>
            </div>
            <Button className="w-full" onClick={handleSubmit}>
              {mode === 'edit' ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
