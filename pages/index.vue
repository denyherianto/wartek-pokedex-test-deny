<template>
  <div>
    <v-app-bar :clipped-left="false" fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <template v-if="$nuxt.isOffline">
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="12" justify="center" align="center">
              <h2 class="mb-1">You're offline!</h2>
              <h4 class="mb-5">See your saved items here!</h4>
              <div>
                <v-btn tag="nuxt-link" to="/bookmarks"> Bookmarks </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-else>
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="12">
              <v-row>
                <v-col
                  v-for="(item, key) in pokemons"
                  :key="`pokemon-list-${key}`"
                  cols="6"
                  md="3"
                >
                  <nuxt-link :to="`/${item.name}`">
                    <species-card :item="item" />
                  </nuxt-link>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <client-only>
            <infinite-loading
              v-if="pokemons.length"
              spinner="spiral"
              @infinite="loadMore"
            />
          </client-only>
        </v-container>
      </template>
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import InfiniteLoading from 'vue-infinite-loading'
import SpeciesCard from '@/components/SpeciesCard.vue'
import PokemonsQueryGQL from '@/apollo/queries/Pokemons.graphql'
/* eslint-disable */
import {
  Pokemon_V2_Pokemon,
  Query_RootPokemon_V2_PokemonArgs,
} from '~/types/types'
/* eslint-enable */

const DEFAULT_LIMIT = 12
const DEFAULT_PAGE = 1
const DEFAULT_OFFSET = 0
const DEFAULT_COUNT = 0

@Component({
  components: { SpeciesCard, InfiniteLoading },
})
export default class MainPage extends Vue {
  // eslint-disable-next-line
  pokemons: Array<Pokemon_V2_Pokemon> | object[] = []
  title: String = 'PokeDex'
  limit: number = DEFAULT_LIMIT
  page: number = DEFAULT_PAGE
  offset: number = DEFAULT_OFFSET
  count: number = DEFAULT_COUNT
  fetching: Boolean = false

  async fetch() {
    const client = this.$apollo.getClient()
    const query = PokemonsQueryGQL
    const variables = {
      limit: DEFAULT_LIMIT,
      offset: 0,
    } as Query_RootPokemon_V2_PokemonArgs // eslint-disable-line
    const { data } = await client.query({ query, variables })
    const { pokemons, aggregate } = data
    const { count } = aggregate.aggregate
    this.pokemons = pokemons
    this.count = count
  }

  async loadMore($state: any): Promise<void> {
    if (this.fetching) return

    this.fetching = true
    this.offset = this.page * this.limit

    try {
      const client = this.$apollo.getClient()
      const query = PokemonsQueryGQL
      const variables = {
        offset: this.offset,
        limit: this.limit,
      } as Query_RootPokemon_V2_PokemonArgs // eslint-disable-line
      const { data } = await client.query({ query, variables })

      if (data.pokemons.length) {
        data.pokemons.forEach((pokemon: any) => {
          this.pokemons.push(pokemon)
        })
        this.fetching = false
        this.page++
        $state.loaded()
      } else {
        $state.complete()
      }
    } catch (error: any) {
      console.log(error)
    }
  }
}
</script>
