export type SteamGame = {
  abbr: string;
  title: string;
  genre: string;
  url: string;
  colors: [string, string];
};

export const STUDIO_DATA: SteamGame[] = [
  {
    abbr: 'GD',
    title: 'Goal Deck',
    genre: 'Roguelike Deckbuilding / Sports',
    url: 'https://store.steampowered.com/app/4638590/Goaldeck/',
    colors: ['#3B82F6', '#F59E0B'],
  },
];
