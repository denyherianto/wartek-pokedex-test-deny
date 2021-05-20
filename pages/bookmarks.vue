<template>
  <div>
    <v-app-bar :clipped-left="false" fixed app>
      <v-btn icon tag="nuxt-link" to="/">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="12">
            <v-row>
              <v-col
                v-for="(item, key) in bookmarks"
                :key="`pokemon-list-${key}`"
                cols="6"
                md="3"
              >
                <nuxt-link :to="`/${item[0].pokemon[0].name}`">
                  <species-card :item="item[0].pokemon[0]" />
                </nuxt-link>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SpeciesCard from '@/components/SpeciesCard.vue'
// eslint-disable-next-line
import { Pokemon_V2_Pokemonspecies } from '~/types/types'

const BOOKMARK_KEY = 'bookmarks'

@Component({
  components: { SpeciesCard },
})
export default class BookmarksPage extends Vue {
  // eslint-disable-next-line
  bookmarks: Array<Pokemon_V2_Pokemonspecies> | [] = []
  title: String = 'Bookmarks'

  mounted() {
    this.bookmarks = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '{}')
  }
}
</script>
