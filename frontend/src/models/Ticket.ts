export enum TicketPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

export enum TicketStatus {
  Open = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4,
}

export enum TicketCategory {
  Bug = 1,
  FeatureRequest = 2,
  Support = 3,
  Enhancement = 4,
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  status: TicketStatus;
  createdById: string;
  assignedToId: string | null;
  createdAt: string;
}

export const priorityLabel: Record<TicketPriority, string> = {
  [TicketPriority.Low]: 'Low',
  [TicketPriority.Medium]: 'Medium',
  [TicketPriority.High]: 'High',
  [TicketPriority.Critical]: 'Critical',
};

export const statusLabel: Record<TicketStatus, string> = {
  [TicketStatus.Open]: 'Open',
  [TicketStatus.InProgress]: 'In Progress',
  [TicketStatus.Resolved]: 'Resolved',
  [TicketStatus.Closed]: 'Closed',
};

export const categoryLabel: Record<TicketCategory, string> = {
  [TicketCategory.Bug]: 'Bug',
  [TicketCategory.FeatureRequest]: 'Feature Request',
  [TicketCategory.Support]: 'Support',
  [TicketCategory.Enhancement]: 'Enhancement',
};

export const priorityColor: Record<TicketPriority, 'default' | 'info' | 'warning' | 'error'> = {
  [TicketPriority.Low]: 'default',
  [TicketPriority.Medium]: 'info',
  [TicketPriority.High]: 'warning',
  [TicketPriority.Critical]: 'error',
};

export const statusColor: Record<TicketStatus, 'default' | 'info' | 'success' | 'error'> = {
  [TicketStatus.Open]: 'info',
  [TicketStatus.InProgress]: 'default',
  [TicketStatus.Resolved]: 'success',
  [TicketStatus.Closed]: 'error',
};
