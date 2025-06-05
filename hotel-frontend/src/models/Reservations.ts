import { Client } from "./Client";
import { Room } from "./Room";

export type Reservation = {
  id: number;
  clientId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  client: Client;
  room: Room;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeReservation = (res: any): Reservation => ({
  id: res.id,
  client: res.client,
  clientId: res.client_id,
  room: res.room,
  roomId: res.room_id,
  checkInDate: res.check_in_date,
  checkOutDate: res.check_out_date,
  status: res.status,
  totalAmount: parseFloat(res.total_amount),
  paymentStatus: res.payment_status,
  paymentMethod: res.payment_method,
});
