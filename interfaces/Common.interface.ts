import { AxiosError } from "axios";

enum ChatMessageStatus {
  SEDNING = "sending",
  SENT = "sent",
  SEEN = "seen",
}

export enum ConnectionStatus {
  CONNECTED = "connected",
  NULL = "null",
  PENDING = "pending",
  SENT = "sent",
}

export enum UserAuthStatus {
  AUTHENTICATED = "authenticated",
  LOADING = "loading",
  UNAUTHENTICATED = "unauthenticated",
}

export enum PostCategories {
  GENERAL = "general",
  QUERY = "query",
}

export enum UserPostFilter {
  COMMENTED = "commented",
  LIKED = "liked",
  POSTED = "posted",
}

export enum PostSortingOptions {
  DATE = "date",
  TRENDING = "trending",
}

export interface User {
  bio: string;
  image: string;
  name: string;
  username: string;
}

export interface UserWithStats extends User {
  badges: string[];
  blacklist: string[];
  connections: OwnConnection[];
  posts: Post[];
  savedPosts: string[];
}

export interface PostComment {
  _id: string;
  postedBy: string;
  comment: string;
  timestamp: Date;
}

export interface Post {
  _id: string;
  caption: string;
  category: PostCategories;
  comments: PostComment[];
  commentsActive: boolean;
  lastModified: string;
  likes: string[];
  media: string | null;
  postedBy: {
    image: string;
    name: string;
    username: string;
  };
}

export interface ChatMessage {
  _id: string;
  message: string;
  sender: string;
  status: ChatMessageStatus;
  receiver: string;
  timestamp: string;
}

export interface Chat {
  _id: string;
  chatBetween: { image: string; name: string; username: string }[];
  conversation: ChatMessage[];
  timestamp: string;
}

export interface ChatPreview {
  _id: string;
  avatar: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
}

export interface Connection {
  connectionWith: User;
}

export interface OwnConnection extends Connection {
  _id: string;
  initiatedBy: string;
  isActive: boolean;
}

export interface ConnectionInDatabase {
  _id: string;
  connectionBetween: [User, User];
  initiatedBy: string;
  isActive: boolean;
  timestamp: Date;
}

export type BasicAxiosError = AxiosError<
  { message: string; data: unknown } | undefined
>;

export interface UpdatePost {
  caption?: string;
  category?: PostCategories;
  media?: File | null;
}

export interface PaginationData {
  count: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
}
