export type Train = {
    number: string;
    name: string;
    from: string;
    to: string;
    depart: string;
    arrive: string;
    duration?: string;
  };
  
  export type SearchResult = {
    trains: Train[];
  };
  