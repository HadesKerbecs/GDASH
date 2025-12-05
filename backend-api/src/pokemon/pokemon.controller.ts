import { Controller, Get, Query, Param } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";

@Controller("api/pokemon")
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get()
  async list(@Query("page") page = 1) {
    return this.service.list(Number(page));
  }

  @Get("search")
  async search(@Query("q") q: string) {
    return this.service.search(q);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.service.get(id);
  }
}
