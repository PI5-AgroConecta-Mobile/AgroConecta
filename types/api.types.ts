export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
  ownerId: string;
  type: number;      
  harvestDate: string; 
  harvestType: number; 
  productState: boolean;
  harvest: string;
  unityType: number;
  farmName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number; 
}

export interface ApiUser {
  id: string;
  name: string;
}