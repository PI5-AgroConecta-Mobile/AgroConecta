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
}

export interface ApiUser {
  id: string;
  name: string;
  // ... outros campos do seu model user
}