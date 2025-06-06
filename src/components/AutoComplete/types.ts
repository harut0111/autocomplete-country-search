export interface User {
  id: string;
  countryName: string;
}

export type Country = { name: { common: string }; flag: string; cca3: string };
