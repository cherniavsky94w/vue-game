<template>
<md-button @click="catchClick" :class="{'square': true, 'active-color': active, 'default-color': !active, 'success-color': catched}" :style="{'width': sizePx,'min-width': sizePx,'height': sizePx,'min-height': sizePx}"></md-button>
</template>

<script>
export default {
  props: {
    xpos: {
      type: Number,
      required: true
    },
    ypos: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      default: 0,
    },
    xcurrent: {
      type: Number,
      default: 0,
    },
    ycurrent: {
      type: Number,
      default: 0,
    }
  },
  computed: {
    sizePx() {
      return `${this.size - 2}px`
    }
  },
  data() {
    return {
      active: false,
      catched: false
    }
  },
  watch: {
    xcurrent: function(o) {
      this.compare()
    },
    ycurrent: function(o) {
      this.compare()
    },
  },
  methods: {
    compare() {
      if (this.xcurrent === this.xpos && this.ycurrent === this.ypos) return this.active = true;
      else this.active = false
    },
    catchClick() {
      this.$emit('update-score', this.active)
      if (this.active) {
        this.catched = true
        setTimeout(() => {
          this.catched = false
        }, 2000);
      }
      this.active = false
    }
  }
}
</script>

<style lang="css" scoped>

.default-color {
  background-color: #448aff !important;
}

.active-color {
  background-color: #ffeb3b !important;
}

.success-color {
  background-color: #00c853 !important;
}

.square {
  border-radius: 0 !important;
  margin: 1px !important;
}

</style>
