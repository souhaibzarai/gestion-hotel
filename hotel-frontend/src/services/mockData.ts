
// Room Types
export const ROOM_TYPES = {
  SINGLE: 'Simple',
  DOUBLE: 'Double',
  SUITE: 'Suite',
  DELUXE: 'Deluxe'
};

// Room Status
export const ROOM_STATUS = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Réservée',
  OCCUPIED: 'Occupée',
  CLEANING: 'En nettoyage',
  MAINTENANCE: 'Maintenance'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'Espèces',
  CREDIT_CARD: 'Carte Bancaire',
  TRANSFER: 'Virement'
};

// Mock rooms data
export const mockRooms = [
  {
    id: 1,
    number: '101',
    type: ROOM_TYPES.SINGLE,
    status: ROOM_STATUS.AVAILABLE,
    price: 80,
    capacity: 1
  },
  {
    id: 2,
    number: '102',
    type: ROOM_TYPES.DOUBLE,
    status: ROOM_STATUS.OCCUPIED,
    price: 120,
    capacity: 2
  },
  {
    id: 3,
    number: '103',
    type: ROOM_TYPES.DOUBLE,
    status: ROOM_STATUS.RESERVED,
    price: 120,
    capacity: 2
  },
  {
    id: 4,
    number: '104',
    type: ROOM_TYPES.SUITE,
    status: ROOM_STATUS.CLEANING,
    price: 200,
    capacity: 4
  },
  {
    id: 5,
    number: '105',
    type: ROOM_TYPES.SUITE,
    status: ROOM_STATUS.AVAILABLE,
    price: 220,
    capacity: 3
  },
  {
    id: 6,
    number: '201',
    type: ROOM_TYPES.SINGLE,
    status: ROOM_STATUS.AVAILABLE,
    price: 80,
    capacity: 1
  },
  {
    id: 7,
    number: '202',
    type: ROOM_TYPES.DOUBLE,
    status: ROOM_STATUS.AVAILABLE,
    price: 120,
    capacity: 2
  },
  {
    id: 8,
    number: '203',
    type: ROOM_TYPES.DELUXE,
    status: ROOM_STATUS.MAINTENANCE,
    price: 250,
    capacity: 3
  },
  {
    id: 9,
    number: '204',
    type: ROOM_TYPES.SINGLE,
    status: ROOM_STATUS.AVAILABLE,
    price: 90,
    capacity: 1
  },
  {
    id: 10,
    number: '205',
    type: ROOM_TYPES.DELUXE,
    status: ROOM_STATUS.OCCUPIED,
    price: 250,
    capacity: 3
  }
];

// Mock clients data
export const mockClients = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    document: 'PA12345',
    documentType: 'Passport',
    registrationDate: '2023-01-15'
  },
  {
    id: 2,
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    phone: '07 23 45 67 89',
    document: 'CI7890',
    documentType: 'CIN',
    registrationDate: '2023-02-20'
  },
  {
    id: 3,
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'pierre.bernard@example.com',
    phone: '06 34 56 78 90',
    document: 'PA54321',
    documentType: 'Passport',
    registrationDate: '2023-03-10'
  },
  {
    id: 4,
    firstName: 'Sophie',
    lastName: 'Petit',
    email: 'sophie.petit@example.com',
    phone: '07 45 67 89 01',
    document: 'CI5432',
    documentType: 'CIN',
    registrationDate: '2023-04-05'
  },
  {
    id: 5,
    firstName: 'Nicolas',
    lastName: 'Rousseau',
    email: 'nicolas.rousseau@example.com',
    phone: '06 56 78 90 12',
    document: 'PA98765',
    documentType: 'Passport',
    registrationDate: '2023-05-15'
  }
];

// Mock reservations data
export const mockReservations = [
  {
    id: 1,
    clientId: 1,
    roomId: 2,
    checkInDate: '2023-06-10',
    checkOutDate: '2023-06-15',
    status: 'En cours',
    totalAmount: 600,
    paymentStatus: 'Payé'
  },
  {
    id: 2,
    clientId: 2,
    roomId: 3,
    checkInDate: '2023-06-15',
    checkOutDate: '2023-06-18',
    status: 'Confirmée',
    totalAmount: 360,
    paymentStatus: 'Partiel'
  },
  {
    id: 3,
    clientId: 3,
    roomId: 5,
    checkInDate: '2023-07-01',
    checkOutDate: '2023-07-05',
    status: 'Confirmée',
    totalAmount: 880,
    paymentStatus: 'En attente'
  },
  {
    id: 4,
    clientId: 4,
    roomId: 1,
    checkInDate: '2023-06-20',
    checkOutDate: '2023-06-25',
    status: 'Terminée',
    totalAmount: 400,
    paymentStatus: 'Payé'
  },
  {
    id: 5,
    clientId: 5,
    roomId: 10,
    checkInDate: '2023-06-18',
    checkOutDate: '2023-06-22',
    status: 'En cours',
    totalAmount: 1000,
    paymentStatus: 'Payé'
  }
];

// Mock payments data
export const mockPayments = [
  {
    id: 1,
    reservationId: 1,
    amount: 600,
    method: PAYMENT_METHODS.CREDIT_CARD,
    date: '2023-06-10',
    status: 'Complété'
  },
  {
    id: 2,
    reservationId: 2,
    amount: 200,
    method: PAYMENT_METHODS.CASH,
    date: '2023-06-15',
    status: 'Complété'
  },
  {
    id: 3,
    reservationId: 4,
    amount: 400,
    method: PAYMENT_METHODS.TRANSFER,
    date: '2023-06-20',
    status: 'Complété'
  },
  {
    id: 4,
    reservationId: 5,
    amount: 1000,
    method: PAYMENT_METHODS.CREDIT_CARD,
    date: '2023-06-18',
    status: 'Complété'
  }
];

// Dashboard stats
export const getDashboardStats = () => {
  const availableRooms = mockRooms.filter(room => room.status === ROOM_STATUS.AVAILABLE).length;
  const occupiedRooms = mockRooms.filter(room => room.status === ROOM_STATUS.OCCUPIED).length;
  const reservedRooms = mockRooms.filter(room => room.status === ROOM_STATUS.RESERVED).length;
  const totalRooms = mockRooms.length;
  
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
  
  const todayCheckIns = mockReservations.filter(r => r.checkInDate === '2023-06-18').length;
  const todayCheckOuts = mockReservations.filter(r => r.checkOutDate === '2023-06-18').length;
  
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  return {
    availableRooms,
    occupiedRooms,
    reservedRooms,
    totalRooms,
    occupancyRate,
    todayCheckIns,
    todayCheckOuts,
    totalRevenue,
    revenueStats: [
      { month: 'Jan', revenue: 12000 },
      { month: 'Fév', revenue: 15000 },
      { month: 'Mar', revenue: 18000 },
      { month: 'Avr', revenue: 16000 },
      { month: 'Mai', revenue: 20000 },
      { month: 'Juin', revenue: totalRevenue }
    ],
    occupancyStats: [
      { month: 'Jan', rate: 65 },
      { month: 'Fév', rate: 70 },
      { month: 'Mar', rate: 75 },
      { month: 'Avr', rate: 68 },
      { month: 'Mai', rate: 72 },
      { month: 'Juin', rate: occupancyRate }
    ]
  };
};

export const getRoomService = () => {
  return {
    getAll: () => Promise.resolve(mockRooms),
    getById: (id: number) => Promise.resolve(mockRooms.find(room => room.id === id)),
    getAvailable: () => Promise.resolve(mockRooms.filter(room => room.status === ROOM_STATUS.AVAILABLE)),
    updateStatus: (id: number, status: string) => {
      // In a real app, this would update the status in the database
      return Promise.resolve({ success: true });
    }
  };
};

export const getClientService = () => {
  return {
    getAll: () => Promise.resolve(mockClients),
    getById: (id: number) => Promise.resolve(mockClients.find(client => client.id === id)),
    create: (client: any) => {
      // In a real app, this would add a client to the database
      return Promise.resolve({ success: true, client: { id: Date.now(), ...client } });
    }
  };
};

export const getReservationService = () => {
  return {
    getAll: () => Promise.resolve(mockReservations),
    getById: (id: number) => Promise.resolve(mockReservations.find(res => res.id === id)),
    getByClient: (clientId: number) => Promise.resolve(
      mockReservations.filter(res => res.clientId === clientId)
    ),
    create: (reservation: any) => {
      // In a real app, this would add a reservation to the database
      return Promise.resolve({ success: true, reservation: { id: Date.now(), ...reservation } });
    }
  };
};
