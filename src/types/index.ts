export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

export type TravelEntry = {
  id: string;
  imageUri: string;
  address: string;
  date: string;
  note?: string;
};