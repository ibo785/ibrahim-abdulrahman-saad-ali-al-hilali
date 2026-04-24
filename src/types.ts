export enum ItemStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  RESERVED = 'reserved',
  EXCHANGED = 'exchanged',
}

export enum ItemCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

export enum TransactionType {
  DONATION = 'donation',
  EXCHANGE = 'exchange',
  REQUEST = 'request',
}

export enum TransactionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  points: number;
  trustLevel: number;
  avatar?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id?: string;
  ownerId: string;
  categoryId: string;
  title: string;
  description: string;
  condition: ItemCondition;
  status: ItemStatus;
  imageUrls: string[];
  aiSuggestedCategory?: string;
  aiConfidence?: number;
  aiProcessed: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Transaction {
  id?: string;
  itemId: string;
  providerId: string;
  receiverId: string;
  type: TransactionType;
  status: TransactionStatus;
  message?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  itemId?: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
