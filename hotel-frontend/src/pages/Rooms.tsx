
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { createRoom, deleteRoom, fetchRooms, updateRoomStatus } from '@/services/api';


const statusLabelMap: Record<string, string> = {
  AVAILABLE: 'Disponible',
  OCCUPIED: 'Occupée',
  RESERVED: 'Réservée',
  CLEANING: 'Nettoyage',
  MAINTENANCE: 'Maintenance',
};

import { Search, Plus, BedDouble, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { ROOM_STATUS } from './ROOM_STATUS';
import { ROOM_TYPES } from './ROOM_TYPES';
import { ApiValidationError } from '@/services/ApiValidationError';

interface Room {
  id: number;
  number: string;
  type: string;
  status: string;
  price: number;
  capacity: number;
}

const getRoomStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800';
    case 'OCCUPIED':
      return 'bg-red-100 text-red-800';
    case 'RESERVED':
      return 'bg-blue-100 text-blue-800';
    case 'CLEANING':
      return 'bg-yellow-100 text-yellow-800';
    case 'MAINTENANCE':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const RoomCard = ({
  room,
  onEditStatus,
  onDelete,
}: {
  room: Room;
  onEditStatus: (room: Room) => void;
  onDelete: (room: Room) => void;
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-3 bg-primary" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Chambre {room.number}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getRoomStatusColor(room.status)}>
              {statusLabelMap[room.status] ?? room.status}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-800"
              onClick={() => onDelete(room)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>{room.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mb-2">
          <span>Prix:</span>
          <span className="font-semibold">{room.price} €/nuit</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Capacité:</span>
          <span className="font-semibold">
            {room.capacity} {room.capacity > 1 ? 'personnes' : 'personne'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => onEditStatus(room)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Modifier le statut
        </Button>
      </CardFooter>
    </Card>
  );
};


const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newRoomDialog, setNewRoomDialog] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: ROOM_TYPES.SINGLE,
    price: 80,
    capacity: 1,
  });

  useEffect(() => {
    const getRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
        setFilteredRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("Erreur lors du chargement des chambres");
      } finally {
        setIsLoading(false);
      }
    };

    getRooms();
  }, []);

  useEffect(() => {
    let result = [...rooms];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(room =>
        room.number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(room => room.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(room => room.type === typeFilter);
    }

    setFilteredRooms(result);
  }, [searchQuery, statusFilter, typeFilter, rooms]);

  const handleStatusChange = async () => {
    if (!selectedRoom || !newStatus) return;

    try {
      const updated = await updateRoomStatus(selectedRoom.id, newStatus);

      const updatedRooms = rooms.map(room =>
        room.id === updated.id ? updated : room
      );

      setRooms(updatedRooms);
      toast.success(`Statut de la chambre ${updated.number} mis à jour`);
      setDialogOpen(false);
    } catch (e: unknown) {
      const err = e as ApiValidationError;

      if (err.details) {
        const messages = Object.values(err.details).flat();
        toast.error(messages[0]);
      } else if (err instanceof Error) {
        toast.error(err.message || 'Erreur de mise à jour');
      } else {
        toast.error('Erreur inconnue lors de la mise à jour');
      }
    }
  };

  const handleEditStatus = (room: Room) => {
    setSelectedRoom(room);
    setNewStatus(room.status);
    setDialogOpen(true);
  };

  const handleDeleteRoom = async (room: Room) => {
    if (!confirm(`Supprimer la chambre ${room.number} ?`)) return;

    try {
      await deleteRoom(room.id);
      setRooms(rooms.filter(r => r.id !== room.id));
      toast.success(`Chambre ${room.number} supprimée`);
    } catch (e: unknown) {
      const err = e as ApiValidationError;

      if (err.details) {
        const messages = Object.values(err.details).flat();
        toast.error(messages[0]);
      } else if (err instanceof Error) {
        toast.error(err.message || 'Erreur lors de la suppression');
      } else {
        toast.error('Erreur inconnue lors de la suppression');
      }
    }
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-pulse text-primary">Chargement des chambres...</div>
      </div>
    );
  }

  const handleCreateRoom = async () => {
    if (!newRoom.number || !newRoom.type) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const newRoomData = {
        ...newRoom,
        status: ROOM_STATUS.AVAILABLE,
      };

      const created = await createRoom(newRoomData);
      setRooms([...rooms, created]);
      toast.success(`Chambre ${created.number} créée avec succès`);

      setNewRoomDialog(false);
      setNewRoom({
        number: '',
        type: ROOM_TYPES.SINGLE,
        price: 80,
        capacity: 1,
      });
    } catch (e: unknown) {
      const err = e as ApiValidationError;

      if (err.details) {
        const messages = Object.values(err.details).flat();
        toast.error(messages[0]);
      } else if (err instanceof Error) {
        toast.error(err.message || 'Erreur lors de la création de la chambre');
      } else {
        toast.error('Erreur inconnue lors de la création de la chambre');
      }
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Chambres</h1>
          <p className="text-muted-foreground">Gérez les chambres de l'hôtel et leurs statuts</p>
        </div>

        <Dialog open={newRoomDialog} onOpenChange={setNewRoomDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Chambre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle chambre</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle chambre
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="roomNumber">Numéro de chambre</Label>
                <Input
                  id="roomNumber"
                  value={newRoom.number}
                  onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                  placeholder="ex: 101"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="roomType">Type de chambre</Label>
                <Select
                  value={newRoom.type}
                  onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}
                >
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ROOM_TYPES).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="roomPrice">Prix par nuit (€)</Label>
                <Input
                  id="roomPrice"
                  type="number"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({ ...newRoom, price: parseInt(e.target.value) })}
                  min={1}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="roomCapacity">Capacité</Label>
                <Input
                  id="roomCapacity"
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setNewRoomDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateRoom}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro de chambre..."
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
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.keys(ROOM_STATUS).map((key) => (
              <SelectItem key={key} value={ROOM_STATUS[key]}>
                {statusLabelMap[ROOM_STATUS[key]]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.values(ROOM_TYPES).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-lg">
          <BedDouble className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-xl font-medium">Aucune chambre trouvée</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres ou d'ajouter une nouvelle chambre
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onEditStatus={handleEditStatus} onDelete={handleDeleteRoom} />
          ))}
        </div>
      )}

      {/* Edit Status Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Modifier le statut - Chambre {selectedRoom?.number}
            </DialogTitle>
            <DialogDescription>
              Sélectionnez le nouveau statut pour cette chambre
            </DialogDescription>
          </DialogHeader>

          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ROOM_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleStatusChange}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
