import { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  BedDouble, CalendarCheck, Users, EuroIcon, TrendingUp
} from 'lucide-react';
import { fetchDashboardStats } from '@/services/api';
import { DashboardStats } from "@/services/DashboardStats";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, description, icon, className }: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}) => (
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
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
        <StatCard title="Chambres Disponibles" value={`${stats.availableRooms}/${stats.totalRooms}`} icon={<BedDouble className="h-4 w-4" />} />
        <StatCard title="Taux d'Occupation" value={`${stats.occupancyRate}%`} icon={<TrendingUp className="h-4 w-4" />} description="Pourcentage de chambres occupées" />
        <StatCard title="Check-ins Aujourd'hui" value={stats.todayCheckIns} icon={<CalendarCheck className="h-4 w-4" />} />
        <StatCard title="Revenue Total" value={`${stats.totalRevenue} €`} icon={<EuroIcon className="h-4 w-4" />} description="Tous paiements confondus" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
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
                <Tooltip formatter={(v) => [`${v} €`, "Revenu"]} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
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
                <Tooltip formatter={(v) => [`${v}%`, "Taux d'occupation"]} />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières Activités</CardTitle>
          <CardDescription>Réservations récemment ajoutées</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.latestReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-lg">
              <CalendarCheck className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-xl font-medium">Aucune activité récente</h3>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Chambre</th>
                  <th className="px-4 py-3">Check-in</th>
                  <th className="px-4 py-3">Check-out</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.latestReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="px-4 py-2">{r.client.firstName} {r.client.lastName}</td>
                    <td className="px-4 py-2">{r.room.number}</td>
                    <td className="px-4 py-2">{new Date(r.check_in_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(r.check_out_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${r.status === 'Confirmée' ? 'bg-blue-100 text-blue-800' :
                        r.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                          r.status === 'Terminée' ? 'bg-green-100 text-green-800' :
                            r.status === 'Annulée' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-600'
                        }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{r.total_amount} DH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
export default Dashboard;