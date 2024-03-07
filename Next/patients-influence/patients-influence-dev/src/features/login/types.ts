export type TLoginValidatingState = {
  loading: boolean;
  role: 'influencer' | 'company' | null;
  error: boolean;
};
