<template>
  <div class="icon-container" v-if="iconName === 'discover'"><Discover /></div>
  <div class="icon-container" v-else-if="iconName === 'build-buisiness-case'">
    <BuildBusinessCase />
  </div>
  <div class="icon-container" v-else-if="iconName === 'development'">
    <Development />
  </div>
  <div class="icon-container" v-else-if="iconName === 'scale-up'">
    <ScaleUp />
  </div>
  <div class="icon-container" v-else-if="iconName === 'launch'"><Launch /></div>
  <div class="icon-container" v-else-if="iconName === 'check'"><Check /></div>
  <div class="icon-container" v-else-if="iconName === 'lock'"><Lock /></div>
  <div class="icon-container" v-else-if="iconName === 'biz-opportunity'">
    <BizOpportunity />
  </div>
  <div class="icon-container" v-else-if="iconName === 'customer-market'">
    <CustomerMarket />
  </div>
  <div class="icon-container" v-else-if="iconName === 'legal'"><Legal /></div>
  <div class="icon-container" v-else-if="iconName === 'manufacturing'">
    <Manufacturing />
  </div>
  <div class="icon-container" v-else-if="iconName === 'products'">
    <Products />
  </div>
  <div class="icon-container" v-else-if="iconName === 'audio'">
    <Audio />
  </div>
  <div class="icon-container" v-else-if="iconName === 'search-bars'">
    <Search />
  </div>
  <div class="icon-container" v-else>
    <p>Check Icon Name {{ iconName }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Discover from "@/assets/images/shared/icons/phase icons/discovery.svg"
import BuildBusinessCase from "@/assets/images/shared/icons/phase icons/build-biz-case.svg"
import Development from "@/assets/images/shared/icons/phase icons/development.svg"
import ScaleUp from "@/assets/images/shared/icons/phase icons/scale-up.svg"
import Launch from "@/assets/images/shared/icons/phase icons/launch.svg"
import Check from "@/assets/images/shared/icons/check-circle.svg"
import Lock from "@/assets/images/shared/icons/lock.svg"
import Audio from "@/assets/images/shared/icons/audio-wave.svg"
import Search from "@/assets/images/shared/icons/search-resource.svg"

import BizOpportunity from "@/assets/images/shared/icons/deliverables/biz-opportunity.svg"
import CustomerMarket from "@/assets/images/shared/icons/deliverables/customer-market.svg"
import Legal from "@/assets/images/shared/icons/deliverables/legal.svg"
import Manufacturing from "@/assets/images/shared/icons/deliverables/manufacturing.svg"
import Products from "@/assets/images/shared/icons/deliverables/products.svg"

export default Vue.extend({
  data() {
    return {}
  },
  props: ["iconName"],
  components: {
    Discover,
    BuildBusinessCase,
    Development,
    ScaleUp,
    Launch,
    Check,
    Lock,
    BizOpportunity,
    CustomerMarket,
    Legal,
    Manufacturing,
    Products,
    Audio,
    Search,
  },
})
</script>

<style lang="scss" scoped></style>
