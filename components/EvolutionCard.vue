<template>
  <div id="component-card">
    <v-card elevation="2">
      <v-card-text class="species-card">
        <img :src="image" :alt="item.name" width="60%" />

        <h4 class="species-order">{{ order }}</h4>

        <h2 class="species-name">{{ item.name }}</h2>

        <h5 v-if="minLevel" class="species-min-level">
          Min. Level: {{ minLevel }}
        </h5>

        <!-- <v-chip
          v-for="(item, key) in item.types"
          :key="`species-type-${key}`"
          class="species-type"
          :class="`chip-${item.type.name}`"
          x-small
        >
          {{ item.type.name }}
        </v-chip> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import leftPad from '@/utils/Number/leftPad'

const BASE_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

interface ItemEvolutionInterface {
  min_level: string // eslint-disable-line
}

interface ItemInterface {
  id: number
  name: string
  evolution: Array<ItemEvolutionInterface>
}

@Component
export default class EvolutionCard extends Vue {
  @Prop({ required: true }) readonly item!: ItemInterface

  get isPokemonExists(): Boolean {
    return Object.keys(this.item).length > 0
  }

  get order(): string {
    if (this.isPokemonExists) {
      return `#${leftPad(this.item.id, 3)}`
    }
    return ''
  }

  get minLevel(): string {
    if (this.isPokemonExists) {
      return this.item?.evolution?.[0]?.min_level || ''
    }
    return ''
  }

  get image(): string {
    if (this.item) {
      return `${BASE_IMAGE_URL}/${this.item.id}.png`
    }
    return ''
  }
}
</script>

<style lang="scss">
#component-card {
  .species {
    &-card {
      border-radius: 10px;
      text-align: center;
    }
    &-name {
      color: #fff;
      text-transform: capitalize;
      margin-bottom: 5px;
    }
    &-type {
      margin-right: 5px;
      text-transform: capitalize;
    }
  }
}
</style>
