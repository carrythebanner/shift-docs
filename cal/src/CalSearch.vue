<!-- 
 * Requests search results from the server, and displays them.
 * TODO: requests should limit to say 10-20 events; and next/prev navigate
 -->
<script>
import dayjs from 'dayjs'
import EventSummary from './EventSummary.vue'
import { fetchSearch } from './calSearch.js'

export default {
  components: { EventSummary },
  emits: [ 'pageLoaded' ],
  // called before the component is fully created
  // ( doesnt have access to `this` )
  beforeRouteEnter(to, from, next) {
    console.log(`CalSearch beforeRouteEnter ${to.fullPath}, ${from.fullPath}`);
    // TODO: remember where we came from?
    // ex. could lastEvent or starting date, etc.
    // ex. lastEvent for going to an event and back to search
    next(vm => {
      // access to component public instance via `vm`
      // vm.lastEvent = lastEvent;
      vm.updateSearch(to.query);
    });
  },
  // triggered when naving left/right through weeks.
  beforeRouteUpdate(to, from) { 
    console.log(`CalSearch beforeRouteUpdate to:${to.fullPath}, from: ${from.fullPath}`);
    if (to.query.q !== from.query.q) {
      return this.updateSearch(to.query);
    }
  },
  data() {
    return { 
      // an array of search results ( joined calevent + caldaily records )
      events: [],
    };
  },
  computed: {
    q() {
      return this.$route.query.q;  
    },
    offset() {
      return this.$route.query.offset || 0;
    },
  },
  methods: {
    // emits the 'pageLoaded' event when done.
    updateSearch({q, offset}) {
      return fetchSearch(q, offset).then((page) => {
        const { events } = page.data;
        this.events = events;
        this.$emit("pageLoaded", page);
      }).catch((error) => {
        console.error("updateSearch error:", error);
        this.$emit("pageLoaded", null, error);
      });
    },
  },
}
</script>
<template> 
  <h3 class="c-divder c-divder--center">
    Found {{events.length}} events containing "{{q}}".
  </h3>
  <EventSummary 
      v-for="evt in events" :key="evt.caldaily_id" 
      :evt="evt" 
      :showDate="true"/>
</template>
<style>
/* margin/padding matches EventSummary -- 
  fix: probably the container should handle that uniformly if it can.
 */
.c-search__summary {
  margin: 10px 20px;
  width: 1em auto;
  text-align: center;
  font-weight: bold;
}
</style>