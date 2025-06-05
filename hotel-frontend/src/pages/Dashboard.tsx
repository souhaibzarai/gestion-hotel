import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BedDouble, 
  CalendarCheck, 
  Users, 
  EuroIcon,
  TrendingUp
} from 'lucide-react';
import { getDashboardStats, mockClients } from '@/services/mockData';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, description, icon, className }: StatCardProps) => (
  <Card className={cn("hover:shadow-md transition-all", className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const fetchData = async () => {
      try {
        const data = getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-pulse text-primary">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="text-muted-foreground">Aperçu des activités de l'hôtel et des statistiques clés.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Chambres Disponibles"
          value={`${stats.availableRooms}/${stats.totalRooms}`}
          icon={<BedDouble className="h-4 w-4" />}
        />
        <StatCard
          title="Taux d'Occupation"
          value={`${stats.occupancyRate}%`}
          description="Pourcentage de chambres occupées"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Check-ins Aujourd'hui"
          value={stats.todayCheckIns}
          icon={<CalendarCheck className="h-4 w-4" />}
        />
        <StatCard
          title="Revenue Total"
          value={`${stats.totalRevenue} €`}
          description="Tous paiements confondus"
          icon={<EuroIcon className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenus Mensuels</CardTitle>
            <CardDescription>Revenus sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} €`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Taux d'Occupation</CardTitle>
            <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.occupancyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Taux d'occupation"]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#0ea5e9" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Les dernières réservations et check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <Users className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-medium">Nouvelle réservation</p>
                  <p className="text-sm text-muted-foreground">
                    {mockClients[0].firstName} {mockClients[0].lastName} a réservé une chambre pour 5 jours.
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Il y a 30 minutes
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <CalendarCheck className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-medium">Check-in effectué</p>
                  <p className="text-sm text-muted-foreground">
                    {mockClients[4].firstName} {mockClients[4].lastName} a été enregistré dans la chambre 205.
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Il y a 2 heures
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <EuroIcon className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-medium">Paiement reçu</p>
                  <p className="text-sm text-muted-foreground">
                    Paiement de 1000€ reçu pour la réservation #5.
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Il y a 5 heures
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
