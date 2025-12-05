import { Injectable, NotFoundException } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class PokemonService {
  async list(page: number) {
    const limit = 20;
    const offset = (page - 1) * limit;

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const { data } = await axios.get<any>(url);

    const results = await Promise.all(
      data.results.map(async (item: any) => {
        const id = item.url.split("/").filter(Boolean).pop();
        return {
          id,
          name: item.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      })
    );

    return {
      page,
      totalPages: Math.ceil(1302 / limit),
      results,
    };
  }

  async get(id: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const { data } = await axios.get<any>(url);

    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      image: data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
  }

  // 🔎 BUSCA GLOBAL (nome ou ID)
  async search(query: string) {
    const q = (query || "").trim().toLowerCase();
    if (!q) {
      throw new NotFoundException("Pokémon não encontrado");
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(q)}`;

    try {
      const { data } = await axios.get<any>(url);

      return {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        image: data.sprites.front_default,
        types: data.types.map((t: any) => t.type.name),
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: data.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      };
    } catch (err) {
      throw new NotFoundException("Pokémon não encontrado");
    }
  }
}
