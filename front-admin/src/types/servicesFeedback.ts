export type Waiter = {
  _id: string;
  name: string;
  isActive: boolean;
};

export type FeedbackItem = {
  _id: string;
  rating: number;
  waiter: { _id: string; name: string };
  message: string;
  images: string[]; // /uploads/feedback/filename.jpg
  createdAt: string;
  updatedAt: string;
};

export type Paginated<T> = {
  ok: boolean;
  page: number;
  limit: number;
  total: number;
  items: T[];
};
