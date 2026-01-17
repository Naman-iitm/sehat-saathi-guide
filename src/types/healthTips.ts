export type HealthTip = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type HealthCategory = {
  id: string;
  name: string;
  tips: HealthTip[];
};
