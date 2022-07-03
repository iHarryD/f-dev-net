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
