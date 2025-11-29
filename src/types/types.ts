export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  priority?: Priority;
};
