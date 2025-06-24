
export interface Category {
  id: number;
  name: string;
}

export interface POI {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name?: string;
  location: {
    lat: number;
    lng: number;
  };
  image_urls?: string[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  image_url?: string;
}

export interface CreatePOI {
  name: string;
  description: string;
  category_id: number;
  location: string;
  images: File[];
}

export interface CreateEvent {
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  image?: File;
}
