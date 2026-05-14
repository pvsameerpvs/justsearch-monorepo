export type AgentStatus = 'available' | 'busy' | 'offline';

export type DeliveryBoy = {
  id: string;
  name: string;
  phone: string;
  email: string;
  uniqueId: string;
  username: string;
  password: string;
  isActive: boolean;
  status: AgentStatus;
  currentOrderId: string | null;
  totalDeliveries: number;
  rating: number;
  location: string;
};

export type UpdateAgentData = {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  password?: string;
};

export type AddAgentData = {
  name: string;
  phone: string;
  email: string;
  location: string;
  password: string;
  isActive: boolean;
};

export interface DeliveryBoyStore {
  agents: DeliveryBoy[];
  addAgent: (agent: AddAgentData) => void;
  removeAgent: (id: string) => void;
  toggleActive: (id: string) => void;
  updateAgent: (id: string, data: UpdateAgentData) => void;
  setStatus: (id: string, status: AgentStatus, currentOrderId?: string | null) => void;
}
