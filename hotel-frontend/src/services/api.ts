import { ApiValidationError } from "./ApiValidationError";
import { Room } from "@/models/Room";
import { Client } from "@/models/Client";
import { Reservation } from "@/models/Reservations";
import { DashboardStats } from "./DashboardStats";
import { User, UserPayload } from "@/models/User";

const API_BASE = "http://localhost:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Auth
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erreur de connexion');
  }

  return data;
}

// Settings
export const fetchSettings = async (): Promise<Record<string, string>> => {
  const res = await fetch(`${API_BASE}/settings`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!res.ok) throw new Error("Erreur lors du chargement des paramètres");

  return await res.json();
};

export const updateSettings = async (data: Record<string, string | number>) => {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erreur lors de la mise à jour des paramètres");

  return await res.json();
};

// Users
export const fetchUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  return await res.json();
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}): Promise<User> => {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Erreur serveur') as ApiValidationError;
    error.details = data.errors;
    throw error;
  }

  return data;
};

export const updateUser = async (
  id: number,
  userData: Partial<UserPayload>
): Promise<User> => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  const result = await res.json();

  if (!res.ok) {
    const error = new Error(result.message || 'Erreur serveur') as ApiValidationError;
    error.details = result.errors;
    throw error;
  }

  return result;
};

export const deleteUser = async (id: number) => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'utilisateur");
};

// Rooms
export const fetchRooms = async (): Promise<Room[]> => {
  const res = await fetch(`${API_BASE}/rooms`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return await res.json();
};

export const createRoom = async (roomData: Omit<Room, 'id'>): Promise<Room> => {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Erreur serveur') as ApiValidationError;
    error.details = data.errors;
    throw error;
  }

  return data;
};

export const updateRoomStatus = async (id: number, status: string): Promise<Room> => {
  const res = await fetch(`${API_BASE}/rooms/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Erreur de mise à jour') as ApiValidationError;
    error.details = data.errors;
    throw error;
  }

  return data;
};

export const deleteRoom = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/rooms/${id}`, {
    headers: getAuthHeaders(),
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Erreur lors de la suppression') as ApiValidationError;
    error.details = data.errors;
    throw error;
  }
};

// Clients
export async function fetchClients() {
  const res = await fetch(`${API_BASE}/clients`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des clients");
  return res.json();
}

export const createClient = async (clientData: Omit<Client, "id" | "created_at" | "updated_at">) => {
  const res = await fetch(`${API_BASE}/clients`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(clientData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de la création du client");
  }

  return await res.json();
};

export const updateClient = async (id: number, data: Partial<Client>): Promise<Client> => {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur lors de la mise à jour');
  }

  return await res.json();
};

// Reservations
export const fetchReservations = async (): Promise<Reservation[]> => {
  const res = await fetch(`${API_BASE}/reservations`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des réservations");
  return await res.json();
};

export const createReservation = async (
  data: {
    clientId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    status: string;
    totalAmount: number;
    paymentStatus: string;
    paymentMethod: string,
  }
): Promise<Reservation> => {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur de création");
  }

  return await res.json();
};

export const updateReservationStatus = async (
  id: number,
  data: { status: string }
): Promise<Reservation> => {
  const res = await fetch(`${API_BASE}/reservations/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur de mise à jour');
  }

  return await res.json();
};

export const updateReservationPayment = async (
  id: number,
  data: { payment_status: string }
): Promise<Reservation> => {
  const res = await fetch(`${API_BASE}/reservations/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur de mise à jour du paiement');
  }

  return await res.json();
};

export const updateReservationMethod = async (
  id: number,
  data: { payment_method: string }
): Promise<Reservation> => {
  const res = await fetch(`${API_BASE}/reservations/${id}/method`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur de mise à jour de la méthode');
  }


  return await res.json();
};

export const downloadInvoice = async (reservationId: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/reservations/${reservationId}/invoice`, {
    headers: getAuthHeaders()
  });

  if (!res.ok) throw new Error("Erreur lors du téléchargement");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `facture_reservation_${reservationId}.pdf`;
  link.click();

  window.URL.revokeObjectURL(url);
};

// Dashboard

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: getAuthHeaders()
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return res.json();
}