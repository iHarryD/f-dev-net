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
  postedBy: {
    name: string;
    username: string;
  };
  comment: string;
  timestamp: Date;
}

export interface Post {
  _id: string;
  caption: string;
  comments: PostComment[];
  likes: { username: string; name: string }[];
  media: string[];
  postedBy: {
    name: string;
    username: string;
  };
  timestamp: string;
}
