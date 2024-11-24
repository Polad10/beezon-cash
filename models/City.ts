export enum City {
  Other,
  Tbilisi,
  Batumi,
  Borjomi,
  Rustavi,
  Mtskheta,
  Kobuleti,
}

export function toDisplayString(city: City) {
  switch (city) {
    case City.Other:
      return 'Другой'
    case City.Tbilisi:
      return 'Тбилиси'
    case City.Batumi:
      return 'Батуми'
    case City.Borjomi:
      return 'Боржоми'
    case City.Rustavi:
      return 'Рустави'
    case City.Mtskheta:
      return 'Мцхета'
    case City.Kobuleti:
      return 'Кобулети'
  }
}
