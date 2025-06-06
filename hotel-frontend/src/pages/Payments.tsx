import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Receipt } from "lucide-react";
import { toast } from 'sonner';

import { downloadInvoice, fetchReservations } from '@/services/api';
import { normalizeReservation, Reservation } from '@/models/Reservations';

const getMethodColor = (method: string) => {
  switch (method) {
    case 'Carte Bancaire': return 'bg-blue-100 text-blue-800';
    case 'Espèces': return 'bg-green-100 text-green-800';
    case 'Virement': return 'bg-purple-100 text-purple-800';
    case 'Chèque': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-muted text-muted-foreground';
  }
};
const handleDownloadInvoice = async (id: number) => {
  try {
    await downloadInvoice(id);
    toast.success("Facture téléchargée");
  } catch {
    toast.error("Échec du téléchargement");
  }
}

const Payments = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReservations();
        const normalized = data.map(normalizeReservation);
        setReservations(normalized);
        setFiltered(normalized);
      } catch {
        toast.error("Erreur de chargement des paiements");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const f = reservations.filter(r =>
      `${r.client.firstName} ${r.client.lastName}`.toLowerCase().includes(q) ||
      r.room.number.toLowerCase().includes(q) ||
      r.paymentMethod?.toLowerCase().includes(q) ||
      r.paymentStatus?.toLowerCase().includes(q)
    );
    setFiltered(f);
  }, [search, reservations]);

  const totalAmount = filtered.reduce((sum, r) => sum + r.totalAmount, 0);
  const avgAmount = filtered.length > 0 ? Math.round(totalAmount / filtered.length) : 0;

  if (isLoading) return <div className="text-center mt-24">Chargement...</div>;



  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Paiements</h1>
        <p className="text-muted-foreground">Suivi de tous les paiements et factures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Paiements totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAmount} €</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nombre de transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Montant moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgAmount} €</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par ID, client, méthode..."
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Réservation</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>#{r.id}</TableCell>
                    <TableCell>{`${r.client.firstName} ${r.client.lastName}`}</TableCell>
                    <TableCell>{r.totalAmount} €</TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(r.paymentMethod || 'N/A')}>
                        {r.paymentMethod || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.checkOutDate}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Complété</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(r.id)}>
                        <Receipt className="h-4 w-4 mr-1" />
                        Facture
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default Payments;
