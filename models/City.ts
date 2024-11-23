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
      return 'Other'
    case City.Tbilisi:
      return 'Tbilisi'
    case City.Batumi:
      return 'Batumi'
    case City.Borjomi:
      return 'Borjomi'
    case City.Rustavi:
      return 'Rustavi'
    case City.Mtskheta:
      return 'Mtskheta'
    case City.Kobuleti:
      return 'Kobuleti'
  }
}
