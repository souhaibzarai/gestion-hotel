import { ApiValidationError } from "./ApiValidationError";
import { Room } from "@/models/Room";
import { Client } from "@/models/Client";
import { Reservation } from "@/models/Reservations";

const API_BASE = "http://localhost:8000/api";

// Rooms
export const fetchRooms = async (): Promise<Room[]> => {
  const res = await fetch(`${API_BASE}/rooms`);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return await res.json();
};

export const createRoom = async (roomData: Omit<Room, 'id'>): Promise<Room> => {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch("http://localhost:8000/api/clients");
  if (!res.ok) throw new Error("Erreur lors du chargement des clients");
  return res.json();
}

export const createClient = async (clientData: Omit<Client, "id" | "created_at" | "updated_at">) => {
  const res = await fetch(`${API_BASE}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`${API_BASE}/reservations`);
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
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erreur de mise à jour de la méthode');
  }


  return await res.json();
};