import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

import {
  fetchReservations,
  createReservation,
  fetchRooms,
  fetchClients,
  updateReservationStatus,
  updateReservationPayment,
  updateReservationMethod
} from '@/services/api';

import { ROOM_STATUS } from './ROOM_STATUS';
import { normalizeReservation, Reservation } from '@/models/Reservations';
import { Client } from '@/models/Client';
import { Room } from '@/models/Room';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmée': return 'bg-blue-100 text-blue-800';
    case 'En cours': return 'bg-green-100 text-green-800';
    case 'Terminée': return 'bg-gray-100 text-gray-800';
    case 'Annulée': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'Payé': return 'bg-green-100 text-green-800';
    case 'Partiel': return 'bg-yellow-100 text-yellow-800';
    case 'En attente': return 'bg-orange-100 text-orange-800';
    case 'Remboursé': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newReservationDialog, setNewReservationDialog] = useState(false);
  const [newReservation, setNewReservation] = useState({
    clientId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawReservations = await fetchReservations();
        const reservationsData = rawReservations.map(normalizeReservation);
        const clientsData = await fetchClients();
        const roomsData = await fetchRooms();
        const availableRoomsData = roomsData.filter(r => r.status === 'AVAILABLE');

        setReservations(reservationsData);
        setFilteredReservations(reservationsData);
        setClients(clientsData);
        setRooms(roomsData);
        setAvailableRooms(availableRoomsData);
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...reservations];
    const query = searchQuery.toLowerCase();

    if (searchQuery) {
      result = result.filter(r => {
        const client = clients.find(c => c.id === r.client.id);
        const room = rooms.find(room => room.id === r.room.id);
        return (
          (client && `${client.firstName} ${client.lastName}`.toLowerCase().includes(query)) ||
          (room && room.number.toLowerCase().includes(query)) ||
          r.checkInDate.includes(query) || r.checkOutDate.includes(query)
        );
      });
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    setFilteredReservations(result);
  }, [searchQuery, statusFilter, reservations, clients, rooms]);

  const getClientName = (r: Reservation) => r.client ? `${r.client.firstName} ${r.client.lastName}` : 'Client inconnu';
  const getRoomNumber = (r: Reservation) => r.room ? r.room.number : 'N/A';

  const calculateTotalPrice = () => {
    const room = rooms.find(r => r.id === parseInt(newReservation.roomId));
    if (!room) return 0;
    const checkIn = new Date(newReservation.checkInDate);
    const checkOut = new Date(newReservation.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return room.price * nights;
  };

  const handleCreateReservation = async () => {
    const { clientId, roomId, checkInDate, checkOutDate } = newReservation;
    if (!clientId || !roomId || !checkInDate || !checkOutDate) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error("Date de départ invalide");
      return;
    }

    await createReservation({
      clientId: parseInt(clientId),
      roomId: parseInt(roomId),
      checkInDate,
      checkOutDate,
      status: 'Confirmée',
      totalAmount: calculateTotalPrice(),
      paymentStatus: 'En attente',
      paymentMethod: 'Non défini',
    });


    const fresh = await fetchReservations();
    setReservations(fresh.map(normalizeReservation));
    setNewReservationDialog(false);
    setNewReservation({ clientId: '', roomId: '', checkInDate: '', checkOutDate: '' });
    toast.success("Réservation créée avec succès");
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateReservationStatus(id, { status: newStatus });
      const fresh = await fetchReservations();
      setReservations(fresh.map(normalizeReservation));
      toast.success("Statut mis à jour");
    } catch {
      toast.error("Erreur de mise à jour du statut");
    }
  };

  const handlePaymentChange = async (id: number, paymentStatus: string) => {
    try {
      await updateReservationPayment(id, { payment_status: paymentStatus });
      const fresh = await fetchReservations();
      setReservations(fresh.map(normalizeReservation));
      toast.success("Paiement mis à jour");
    } catch {
      toast.error("Erreur de mise à jour du paiement");
    }
  };

  const handleMethodChange = async (id: number, method: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    try {
      await updateReservationMethod(id, { payment_method: method });
      const fresh = await fetchReservations();
      setReservations(fresh.map(normalizeReservation));
      toast.success("Méthode de paiement mise à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour de la méthode");
    }
  };



  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-6rem)]">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Réservations</h1>
          <p className="text-muted-foreground">Suivi des réservations clients</p>
        </div>
        <Dialog open={newReservationDialog} onOpenChange={setNewReservationDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Réservation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle réservation</DialogTitle>
              <DialogDescription>Renseignez les champs ci-dessous</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Client</Label>
                <Select
                  value={newReservation.clientId}
                  onValueChange={(v) => setNewReservation({ ...newReservation, clientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.firstName} {c.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Chambre</Label>
                <Select
                  value={newReservation.roomId}
                  onValueChange={(v) => setNewReservation({ ...newReservation, roomId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une chambre" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()}>
                        Chambre {r.number} - {r.price}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date d'arrivée</Label>
                  <Input
                    type="date"
                    value={newReservation.checkInDate}
                    onChange={(e) => setNewReservation({ ...newReservation, checkInDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Date de départ</Label>
                  <Input
                    type="date"
                    value={newReservation.checkOutDate}
                    onChange={(e) => setNewReservation({ ...newReservation, checkOutDate: e.target.value })}
                    min={newReservation.checkInDate}
                  />
                </div>
              </div>
              {newReservation.roomId && newReservation.checkInDate && newReservation.checkOutDate && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="font-medium">Montant total:</p>
                  <p className="text-2xl font-bold">{calculateTotalPrice()} €</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewReservationDialog(false)}>Annuler</Button>
              <Button onClick={handleCreateReservation}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Recherche client, chambre ou date"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Confirmée">Confirmée</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminée">Terminée</SelectItem>
                <SelectItem value="Annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-lg">
              <CalendarCheck className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-xl font-medium">Aucune réservation</h3>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Paiement Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{getClientName(r)}</TableCell>
                    <TableCell>{getRoomNumber(r)}</TableCell>
                    <TableCell>{r.checkInDate}</TableCell>
                    <TableCell>{r.checkOutDate}</TableCell>
                    <TableCell>
                      {['Terminée', 'Annulée'].includes(r.status) ? (
                        <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                      ) : !r.paymentMethod || r.paymentMethod === 'Non défini' ? (
                        <span className="text-muted-foreground italic">Définir la méthode</span>
                      ) : (
                        <Select value={r.status} onValueChange={(val) => handleStatusChange(r.id, val)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Confirmée">Confirmée</SelectItem>
                            <SelectItem value="En cours">En cours</SelectItem>
                            <SelectItem value="Terminée">Terminée</SelectItem>
                            <SelectItem value="Annulée">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>{r.totalAmount} €</TableCell>
                    <TableCell>
                      {!r.paymentMethod || r.paymentMethod === 'Non défini' ? (
                        <span className="text-muted-foreground italic">Définir la méthode</span>
                      ) : r.status === 'Terminée' ? (
                        <Badge className={getPaymentStatusColor('Payé')}>Payé</Badge>
                      ) : r.status === 'Annulée' ? (
                        <span className="text-muted-foreground italic">—</span>
                      ) : (
                        <Select value={r.paymentStatus} onValueChange={(val) => handlePaymentChange(r.id, val)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Payé">Payé</SelectItem>
                            <SelectItem value="Partiel">Partiel</SelectItem>
                            <SelectItem value="En attente">En attente</SelectItem>
                            <SelectItem value="Remboursé">Remboursé</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.status === 'Annulée' ? (
                        <span className="text-muted-foreground italic">—</span>
                      ) : ['Annulée', 'Terminée'].includes(r.status) ? (
                        <span className="text-muted-foreground italic">{r.paymentMethod || 'Non défini'}</span>
                      ) : (
                        <Select
                          value={r.paymentMethod || 'Non défini'}
                          onValueChange={(val) => handleMethodChange(r.id, val)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Carte Bancaire">Carte Bancaire</SelectItem>
                            <SelectItem value="Espèces">Espèces</SelectItem>
                            <SelectItem value="Virement">Virement</SelectItem>
                            <SelectItem value="Chèque">Chèque</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reservations;
