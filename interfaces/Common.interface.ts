enum ChatMessageStatus {
  SEDNING = "sending",
  SENT = "sent",
  SEEN = "seen",
}

export interface User {
  bio: string;
  email: string;
  image: string;
  name: string;
  savedPosts: string[];
  username: string;
}

export interface UserWithStats extends User {
  badges: string[];
  connections: string[];
  posts: string[];
}

export interface PostComment {
  postedBy: { image: string; name: string; username: string };
  comment: string;
  timestamp: Date;
}

export interface Post {
  _id: string;
  caption: string;
  comments: PostComment[];
  likes: string[];
  media: string;
  postedBy: {
    image: string;
    name: string;
    username: string;
  };
  timestamp: string;
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
