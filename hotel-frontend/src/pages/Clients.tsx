
import { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchClients, createClient, fetchReservations, updateClient } from '@/services/api';
import { Plus, Search, CalendarCheck, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { normalizeReservation, Reservation } from '@/models/Reservations';
import { Client } from '@/models/Client';



const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientHistoryOpen, setClientHistoryOpen] = useState(false);
  const [clientReservations, setClientReservations] = useState<Reservation[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);


  const [newClientDialog, setNewClientDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    document: '',
    documentType: 'Passport'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await fetchClients();
        const rawReservations = await fetchReservations();

        const normalized = rawReservations.map(normalizeReservation); // ✅ normalize it
        setReservations(normalized); // ✅ now has clientId, roomId, client, room

        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        toast.error("Erreur lors du chargement des clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        client =>
          client.firstName.toLowerCase().includes(query) ||
          client.lastName.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone.includes(query) ||
          client.document.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchQuery, clients]);

  const handleViewClientHistory = (client: Client) => {
    setSelectedClient(client);
    const clientResv = reservations.filter(r => r.clientId === client.id);
    setClientReservations(clientResv);
    setClientHistoryOpen(true);
  };

  const handleCreateClient = async () => {
    if (!newClient.firstName || !newClient.lastName || !newClient.email) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const createdClient = await createClient({
        ...newClient,
        registrationDate: new Date().toISOString().split('T')[0],
      });

      setClients((prev) => [...prev, createdClient]);
      toast.success("Client créé avec succès");
      setNewClientDialog(false);
      setNewClient({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        document: '',
        documentType: 'Passport',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-pulse text-primary">Chargement des clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Clients</h1>
          <p className="text-muted-foreground">Gérez les informations des clients de l'hôtel</p>
        </div>

        <Dialog open={newClientDialog} onOpenChange={setNewClientDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau client</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle fiche client
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={newClient.firstName}
                    onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                    placeholder="Jean"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={newClient.lastName}
                    onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="jean.dupont@example.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="documentType">Type de document</Label>
                  <select
                    id="documentType"
                    value={newClient.documentType}
                    onChange={(e) => setNewClient({ ...newClient, documentType: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Passport">Passport</option>
                    <option value="CIN">CIN</option>
                    <option value="Permis">Permis de conduire</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="document">N° Document</Label>
                  <Input
                    id="document"
                    value={newClient.document}
                    onChange={(e) => setNewClient({ ...newClient, document: e.target.value })}
                    placeholder="PA12345"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setNewClientDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateClient}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-lg">
              <UserPlus className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-xl font-medium">Aucun client trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier votre recherche ou d'ajouter un nouveau client
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Actions</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.firstName} {client.lastName}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || '-'}</TableCell>
                      <TableCell>{client.documentType}: {client.document}</TableCell>
                      <TableCell>{client.registrationDate}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewClientHistory(client)}
                        >
                          <CalendarCheck className="h-4 w-4 mr-2" />
                          Historique
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClient(client);
                            setEditDialogOpen(true);
                          }}
                        >
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={clientHistoryOpen} onOpenChange={setClientHistoryOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Historique du client: {selectedClient?.firstName} {selectedClient?.lastName}
            </DialogTitle>
            <DialogDescription>
              Toutes les réservations et séjours de ce client
            </DialogDescription>
          </DialogHeader>

          {clientReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Ce client n'a pas encore effectué de réservation
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Chambre</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.id}</TableCell>
                      <TableCell>{reservation.room?.number || reservation.roomId}</TableCell>
                      <TableCell>{reservation.checkInDate}</TableCell>
                      <TableCell>{reservation.checkOutDate}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${reservation.status === 'Confirmée'
                            ? 'bg-blue-100 text-blue-800'
                            : reservation.status === 'En cours'
                              ? 'bg-green-100 text-green-800'
                              : reservation.status === 'Terminée'
                                ? 'bg-gray-100 text-gray-800'
                                : reservation.status === 'Annulée'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-muted'
                            }`}
                        >
                          {reservation.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <strong>{reservation.totalAmount} €</strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setClientHistoryOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Seuls le prénom, nom, téléphone et document sont modifiables
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Prénom</Label>
                  <Input
                    value={selectedClient.firstName}
                    onChange={(e) => setSelectedClient({ ...selectedClient, firstName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Nom</Label>
                  <Input
                    value={selectedClient.lastName}
                    onChange={(e) => setSelectedClient({ ...selectedClient, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Téléphone</Label>
                <Input
                  value={selectedClient.phone}
                  onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Document</Label>
                <Input
                  value={selectedClient.document}
                  onChange={(e) => setSelectedClient({ ...selectedClient, document: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Type de document</Label>
                <Input value={selectedClient.documentType} disabled readOnly />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={async () => {
                try {
                  const updated = await updateClient(selectedClient.id, {
                    firstName: selectedClient.firstName,
                    lastName: selectedClient.lastName,
                    phone: selectedClient.phone,
                    document: selectedClient.document,
                  });
                  setClients((prev) =>
                    prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
                  );
                  toast.success("Client mis à jour");
                  setEditDialogOpen(false);
                } catch (err) {
                  toast.error("Erreur de mise à jour");
                }
              }}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Clients;
