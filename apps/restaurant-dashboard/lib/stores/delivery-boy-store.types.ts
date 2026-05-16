export type DeliveryBoy = {
  id: string;
  name: string;
  phone: string;
  email: string;
  username: string;
  isActive: boolean;
  status: string;
  vehicleType: string;
  rating: string;
  completedToday: number;
  shiftLabel: string | null;
  location: string;
  createdAt: string;
};

export type UpdateAgentData = {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  vehicleType?: string;
  isActive?: boolean;
  status?: string;
};

export type AddAgentData = {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  username: string;
  password: string;
  vehicleType?: string;
};

export interface DeliveryBoyStore {
  agents: DeliveryBoy[];
  setAgents: (agents: DeliveryBoy[]) => void;
  addAgent: (agent: DeliveryBoy) => void;
  removeAgent: (id: string) => void;
  toggleActive: (id: string) => void;
  updateAgent: (id: string, data: UpdateAgentData) => void;
  setStatus: (id: string, status: string) => void;
}
