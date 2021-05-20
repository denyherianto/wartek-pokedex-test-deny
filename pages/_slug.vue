<template>
  <div id="page-detail">
    <v-app-bar :clipped-left="false" fixed app>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleBookmark">
        <v-icon
          >mdi-bookmark{{ hasBookmark ? '-check' : '-plus-outline' }}</v-icon
        >
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row justify="center" align="center">
          <v-col v-if="isPokemonExists" cols="12">
            <h4>{{ order }}</h4>

            <h1 class="detail-name">{{ pokemon.name }}</h1>

            <div class="detail-image-wrapper">
              <div><img :src="image" :alt="pokemon.name" width="60%" /></div>

              <div>
                <v-chip
                  v-for="(item, key) in pokemon.types"
                  :key="`detail-type-${key}`"
                  class="detail-type"
                  :class="`chip-${item.type.name}`"
                >
                  {{ item.type.name }}
                </v-chip>
              </div>
            </div>

            <v-tabs class="detail-info" fixed-tabs>
              <v-tab href="#tab-1">Overview</v-tab>
              <v-tab href="#tab-2">Stats</v-tab>
              <v-tab href="#tab-3">Evolution</v-tab>

              <v-tab-item id="tab-1">
                <v-card flat>
                  <v-card-text>
                    <v-row class="mb-2">
                      <v-col>
                        {{ description }}
                      </v-col>
                    </v-row>

                    <h4 class="mb-5">Pokedex Data</h4>
                    <v-row>
                      <v-col cols="3" class="pb-1 pt-1"> Height </v-col>
                      <v-col cols="9" class="pb-1 pt-1">
                        {{ pokemon.height }} meters
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3" class="pb-1 pt-1"> Weight </v-col>
                      <v-col cols="9" class="pb-1 pt-1">
                        {{ pokemon.weight }} kg
                      </v-col>
                    </v-row>
                    <v-row class="mb-2">
                      <v-col cols="3" class="pb-1 pt-1"> Abilities </v-col>
                      <v-col cols="9" class="pb-1 pt-1">
                        <v-chip
                          v-for="(item, key) in pokemon.abilities"
                          :key="`detail-ability-${key}`"
                          x-small
                          class="mr-2"
                        >
                          {{ slugToName(item.ability.name) }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item id="tab-2">
                <v-card flat>
                  <v-card-text>
                    <v-row justify="center" align="center">
                      <v-col
                        v-for="(item, key) in pokemon.stats"
                        :key="`detail-stat-${key}`"
                        cols="12"
                        md="4"
                      >
                        <v-row>
                          <v-col cols="4">
                            <h4>{{ getStatsName(item.stat.name) }}</h4>
                          </v-col>
                          <v-col cols="3">{{ item.base_stat }}</v-col>
                          <v-col cols="5">
                            <v-progress-linear
                              :value="item.base_stat"
                            ></v-progress-linear>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item id="tab-3">
                <v-card flat>
                  <v-card-text>
                    <v-row justify="center" align="center">
                      <v-col cols="12">
                        <v-row>
                          <v-col
                            v-for="(item, key) in eveolutionSpecies"
                            :key="`pokemon-list-${key}`"
                            cols="6"
                            md="3"
                          >
                            <nuxt-link :to="`/${item.name}`">
                              <evolution-card :item="item" />
                            </nuxt-link>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Route } from 'vue-router'
import PokemonQueryGQL from '@/apollo/queries/Pokemon.graphql'
import EvolutionCard from '@/components/EvolutionCard.vue'
import leftPad from '@/utils/Number/leftPad'
import slugToName from '@/utils/String/slugToName'
/* eslint-disable */
import {
  Pokemon_V2_Pokemon,
  Pokemon_V2_Pokemonspecies,
  Query_RootPokemon_V2_PokemonArgs,
} from '~/types/types'
/* eslint-enable */

interface WithRoute {
  $route: Route
}

interface PokemonInterface {
  id: number
  name: string
}

const BOOKMARK_KEY: string = 'bookmarks'

const BASE_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

const STATS_NAME: { [key: string]: string } = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
}

@Component({
  components: { EvolutionCard },
})
export default class DetailPage extends Vue implements WithRoute {
  // eslint-disable-next-line
  pokemons: Array<Pokemon_V2_Pokemonspecies> | [] = []
  title: String = 'Detail'
  bookmark: object = {}

  get dataSource(): any {
    if (this.$nuxt.isOffline) {
      return this.bookmark
    }
    return this.pokemons
  }

  // eslint-disable-next-line
  get pokemon(): PokemonInterface {
    return this.dataSource[0]?.pokemon[0] || {}
  }

  get description(): string {
    return this.dataSource?.[0]?.description?.[0]?.text || ''
  }

  get eveolutionSpecies(): object[] {
    return this.dataSource?.[0]?.evolutions?.species || []
  }

  get isPokemonExists(): Boolean {
    return Object.keys(this.pokemon).length > 0
  }

  get order(): string {
    if (this.isPokemonExists) {
      return `#${leftPad(this.pokemon.id, 3)}`
    }
    return ''
  }

  get hasBookmark(): Boolean {
    return Object.keys(this.bookmark).length > 0
  }

  get image(): string {
    if (this.isPokemonExists) {
      return `${BASE_IMAGE_URL}/${this.pokemon.id}.png`
    }
    return ''
  }

  async fetch() {
    const client = this.$apollo.getClient()
    const query = PokemonQueryGQL
    const variables = {
      name: this.$route.params.slug,
    } as Query_RootPokemon_V2_PokemonArgs // eslint-disable-line
    const { data } = await client.query({ query, variables })
    this.pokemons = data.pokemons
  }

  mounted() {
    const bookmarks: any = JSON.parse(
      localStorage.getItem(BOOKMARK_KEY) || '{}'
    )
    if (bookmarks[this.$route.params.slug]) {
      this.bookmark = bookmarks[this.$route.params.slug]
    }
  }

  getStatsName(slug: string): any {
    // tslint:disable-next-line
    return STATS_NAME[slug] || slug
  }

  toggleBookmark(): void {
    // eslint-disable-next-line
    const bookmarks: { [key: string]: Pokemon_V2_Pokemonspecies[] } = JSON.parse(
      localStorage.getItem(BOOKMARK_KEY) || '{}'
    )

    if (this.hasBookmark) {
      delete bookmarks[this.$route.params.slug]
      this.bookmark = {}
    } else {
      // tslint:disable-next-line
      bookmarks[this.$route.params.slug || ''] = this.pokemons
      this.bookmark = this.pokemons
    }
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks))
  }

  slugToName(str: string): string {
    return slugToName(str)
  }
}
</script>

<style lang="scss" scoped>
#page-detail {
  .detail {
    &-name {
      color: #fff;
      text-transform: capitalize;
      margin-bottom: 5px;
    }
    &-image-wrapper {
      text-align: center;

      img {
        max-width: 300px;
      }
    }
    &-type {
      margin-right: 5px;
      text-transform: capitalize;
    }
    &-info {
      margin-top: 20px;
    }
  }
}
</style>
