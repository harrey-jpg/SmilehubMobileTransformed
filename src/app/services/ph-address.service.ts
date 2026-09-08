import { Injectable } from '@angular/core';

export interface PhPlace {
  code: string;
  name: string;
}

const API = 'https://psgc.gitlab.io/api';
const CACHE_KEY = 'smilehubPhAddressCacheV1';

// Bundled regions so the first dropdown works even offline.
// Provinces/cities/barangays load from the PSGC API and are cached.
const BUNDLED_REGIONS: PhPlace[] = [
  { code: '010000000', name: 'Region I (Ilocos Region)' },
  { code: '020000000', name: 'Region II (Cagayan Valley)' },
  { code: '030000000', name: 'Region III (Central Luzon)' },
  { code: '040000000', name: 'Region IV-A (CALABARZON)' },
  { code: '170000000', name: 'MIMAROPA Region' },
  { code: '050000000', name: 'Region V (Bicol Region)' },
  { code: '060000000', name: 'Region VI (Western Visayas)' },
  { code: '180000000', name: 'Negros Island Region' },
  { code: '070000000', name: 'Region VII (Central Visayas)' },
  { code: '080000000', name: 'Region VIII (Eastern Visayas)' },
  { code: '090000000', name: 'Region IX (Zamboanga Peninsula)' },
  { code: '100000000', name: 'Region X (Northern Mindanao)' },
  { code: '110000000', name: 'Region XI (Davao Region)' },
  { code: '120000000', name: 'Region XII (SOCCSKSARGEN)' },
  { code: '130000000', name: 'National Capital Region (NCR)' },
  { code: '140000000', name: 'Cordillera Administrative Region (CAR)' },
  { code: '150000000', name: 'Bangsamoro Autonomous Region (BARMM)' },
  { code: '160000000', name: 'Region XIII (Caraga)' }
];

@Injectable({ providedIn: 'root' })
export class PhAddressService {
  private mem = new Map<string, PhPlace[]>();

  private readCache(key: string): PhPlace[] | null {
    if (this.mem.has(key)) return this.mem.get(key)!;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const all = JSON.parse(raw);
      const list = Array.isArray(all?.[key]) ? all[key] : null;
      if (list) this.mem.set(key, list);
      return list;
    } catch (_) {
      return null;
    }
  }

  private writeCache(key: string, list: PhPlace[]) {
    this.mem.set(key, list);
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      all[key] = list;
      localStorage.setItem(CACHE_KEY, JSON.stringify(all));
    } catch (_) {}
  }

  private async fetchList(url: string, cacheKey: string): Promise<PhPlace[] | null> {
    const cached = this.readCache(cacheKey);
    if (cached?.length) return cached;
    try {
      const res = await fetch(url);
      if (!res.ok) return cached;
      const data = await res.json();
      const list: PhPlace[] = (Array.isArray(data) ? data : [])
        .filter((d: any) => d?.code && d?.name)
        .map((d: any) => ({ code: String(d.code), name: String(d.name) }))
        .sort((a: PhPlace, b: PhPlace) => a.name.localeCompare(b.name));
      if (list.length) this.writeCache(cacheKey, list);
      return list.length ? list : cached;
    } catch (_) {
      return cached;
    }
  }

  regions(): Promise<PhPlace[]> {
    return this.fetchList(`${API}/regions/`, 'regions').then(r => r?.length ? r : BUNDLED_REGIONS);
  }

  async provinces(regionCode: string): Promise<PhPlace[] | null> {
    return this.fetchList(`${API}/regions/${regionCode}/provinces/`, `prov:${regionCode}`);
  }

  async regionCities(regionCode: string): Promise<PhPlace[] | null> {
    // For NCR (no provinces), cities hang directly under the region.
    return this.fetchList(`${API}/regions/${regionCode}/cities-municipalities/`, `regcity:${regionCode}`);
  }

  async cities(provinceCode: string): Promise<PhPlace[] | null> {
    return this.fetchList(`${API}/provinces/${provinceCode}/cities-municipalities/`, `city:${provinceCode}`);
  }

  async barangays(cityCode: string): Promise<PhPlace[] | null> {
    return this.fetchList(`${API}/cities-municipalities/${cityCode}/barangays/`, `brgy:${cityCode}`);
  }
}
