
export interface Recipe {
  id: string;
  title: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    description?: string;
    followers?: string;
  };
  stats: {
    views: string;
    likes: number;
    bookmarks: number;
  };
  tags: string[];
  cookingTime: string;
  cost: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  number: number;
  description: string;
  image?: string;
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  time: string;
  likes: number;
  replies?: Comment[];
}
