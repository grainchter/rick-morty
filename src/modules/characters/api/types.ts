export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: 'alive' | 'dead' | 'unknown' | '';
  species?: string;
  type?: string;
  gender?: 'female' | 'male' | 'genderless' | 'unknown' | '';
  [key: string]: string | number | boolean | null | undefined;
}

export interface CharacterApiResponse {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharactersApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: CharacterApiResponse[];
}
