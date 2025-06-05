
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { mockPayments, mockReservations, mockClients, PAYMENT_METHODS } from '@/services/mockData';
import { Search, CreditCard, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Payment {
  id: number;
  reservationId: number;
  amount: number;
  method: string;
  date: string;
  status: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data from an API
    const fetchData = () => {
      setTimeout(() => {
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
        setIsLoading(false);
      }, 500);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = payments.filter(payment => {
        const reservation = mockReservations.find(r => r.id === payment.reservationId);
        const client = reservation ? mockClients.find(c => c.id === reservation.clientId) : null;
        
        return (
          payment.id.toString().includes(query) ||
          payment.reservationId.toString().includes(query) ||
          payment.method.toLowerCase().includes(query) ||
          payment.date.includes(query) ||
          (client && `${client.firstName} ${client.lastName}`.toLowerCase().includes(query))
        );
      });
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(payments);
    }
  }, [searchQuery, payments]);

  const getClientNameByReservationId = (reservationId: number) => {
    const reservation = mockReservations.find(r => r.id === reservationId);
    if (!reservation) return 'Client inconnu';
    
    const client = mockClients.find(c => c.id === reservation.clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client inconnu';
  };

  const handleDownloadInvoice = (payment: Payment) => {
    // In a real app, this would generate and download a PDF invoice
    toast.success(`Facture #${payment.id} téléchargée`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-pulse text-primary">Chargement des paiements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Paiements</h1>
        <p className="text-muted-foreground">Suivi de tous les paiements et factures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Paiements totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {payments.reduce((sum, payment) => sum + payment.amount, 0)} €
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nombre de transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{payments.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Montant moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {payments.length > 0 
                ? Math.round(payments.reduce((sum, payment) => sum + payment.amount, 0) / payments.length) 
                : 0} €
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Liste des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ID, client, méthode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-lg">
              <CreditCard className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-xl font-medium">Aucun paiement trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier votre recherche
              </p>
            </div>
          ) : (
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
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>#{payment.reservationId}</TableCell>
                      <TableCell>{getClientNameByReservationId(payment.reservationId)}</TableCell>
                      <TableCell>{payment.amount} €</TableCell>
                      <TableCell>
                        {payment.method === PAYMENT_METHODS.CREDIT_CARD && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {payment.method}
                          </Badge>
                        )}
                        {payment.method === PAYMENT_METHODS.CASH && (
                          <Badge className="bg-green-100 text-green-800">
                            {payment.method}
                          </Badge>
                        )}
                        {payment.method === PAYMENT_METHODS.TRANSFER && (
                          <Badge className="bg-purple-100 text-purple-800">
                            {payment.method}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(payment)}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Facture
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
    </div>
  );
};

export default Payments;
