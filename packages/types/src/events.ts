export interface VitalsUpdatePayload {
  patientId: string;
  heartRate: number;
  spo2: number;
  bp: { systolic: number; diastolic: number };
  temp: number;
  recordedAt: string;
}

export interface NurseLocationPayload {
  nurseId: string;
  lat: number;
  lng: number;
  eta?: number;
}

export interface BookingStatusPayload {
  bookingId: string;
  status: string;
  message: string;
}

export interface NotificationNewPayload {
  title: string;
  body: string;
  type: string;
}

export interface AlertCriticalPayload {
  patientId: string;
  message: string;
  type: string;
}

export interface RoomJoinPayload {
  roomId: string;
}

export interface NurseLocationUpdatePayload {
  lat: number;
  lng: number;
}

export interface ServerToClientEvents {
  "vitals:update": (payload: VitalsUpdatePayload) => void;
  "nurse:location": (payload: NurseLocationPayload) => void;
  "booking:status": (payload: BookingStatusPayload) => void;
  "notification:new": (payload: NotificationNewPayload) => void;
  "alert:critical": (payload: AlertCriticalPayload) => void;
}

export interface ClientToServerEvents {
  "room:join": (payload: RoomJoinPayload) => void;
  "room:leave": (payload: RoomJoinPayload) => void;
  "nurse:location:update": (payload: NurseLocationUpdatePayload) => void;
}

export type EventMap = ServerToClientEvents & ClientToServerEvents;
