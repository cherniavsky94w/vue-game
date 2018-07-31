<template>
<div id="app">
  <md-layout md-gutter class="wrapper">
    <md-dialog ref="helpModal">
      <md-dialog-content>
      <p>
        Click <md-icon>play_arrow</md-icon> button and you need catch yellow square =)<br>
        It is all!
      </p>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="$refs['helpModal'].close()">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog ref="gameResult">
      <md-dialog-content v-if="this.score.computer > this.score.user">
      <p>
        <img src="./assets/lose.svg">
        You are loose =(
      </p>
      </md-dialog-content>
      <md-dialog-content v-if="this.score.computer < this.score.user">
        <p>
          <img src="./assets/win.svg">
          You are win!!!<br/>
          Level up!
        </p>
      </md-dialog-content>
      <md-dialog-content v-if="this.score.computer === this.score.user">Dead heat =(</md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="$refs['gameResult'].close(),stop()">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-layout md-flex="22" md-flex-small="50">
      <md-input-container>
        <md-icon>
          border_bottom
          <md-tooltip>Number by x</md-tooltip>
        </md-icon>
        <md-input :disabled="gameStatus.play"type="number" v-model.number="gameOptions.mx" max="20" min="4"></md-input>
      </md-input-container>
    </md-layout>
    <md-layout md-flex="22" md-flex-small="50">
      <md-input-container>
        <md-icon>
          border_left
          <md-tooltip>Number by y</md-tooltip>
        </md-icon>
        <md-input :disabled="gameStatus.play"type="number" v-model.number="gameOptions.my" max="20" min="4"></md-input>
      </md-input-container>
    </md-layout>
    <md-layout md-flex="22" md-flex-small="50">
      <md-input-container>
        <md-icon>
          timer
          <md-tooltip>Timer in ms</md-tooltip>
        </md-icon>
        <md-input :disabled="gameStatus.play"type="number" v-model.number="gameOptions.timeout" max="20000" min="500"></md-input>
      </md-input-container>
    </md-layout>
    <md-layout md-flex="22" md-flex-small="50">
      <md-input-container>
        <md-icon>
          score
          <md-tooltip>Max score</md-tooltip>
        </md-icon>
        <md-input :disabled="gameStatus.play"type="number" v-model.number="gameOptions.maxScore" max="20000" min="5"></md-input>
      </md-input-container>
    </md-layout>

    <md-layout md-flex="10" md-flex-small="100">
      <md-button :class="{'md-fab start-stop': true, 'md-primary': !gameStatus.play,'md-accent': gameStatus.play}" @click="gameStatus.play ? stop() : start()">
        <md-icon>{{gameStatus.play ? 'stop' : 'play_arrow'}}</md-icon>
      </md-button>
    </md-layout>
  </md-layout>
  <div class="playground">
    <span class="md-headline">You {{score.user}} - {{score.computer}} Computer</span>
    <md-layout v-for="(v,y) in xArray" :key="y" md-align="center">
      <Button v-for="(v,x) in yArray" :key="x" :xpos="x" :ypos="y" :size="buttonSize" :xcurrent="gameStatus.current.x" :ycurrent="gameStatus.current.y" v-on:update-score="updateScore" />
    </md-layout>
    <md-layout md-flex="100" md-align="center">
    <md-button @click="$refs['helpModal'].open()">How to play?</md-button>
    </md-layout>
  </div>
</div>
</template>

<script>
import Button from './components/Button'

export default {
  name: 'App',
  components: {
    Button
  },
  data() {
    return {
      interval: null,
      gameStatus: {
        clicked: true,
        play: false,
        current: {
          x: 0,
          y: 0
        },
      },
      gameOptions: {
        maxScore: 10,
        mx: 10,
        my: 10,
        timeout: 5000,
      },
      score: {
        computer: 0,
        user: 0
      }
    }
  },
  computed: {
    xArray() {
      return (new Array(0 | this.gameOptions.mx)).map((e, i) => i)
    },
    yArray() {
      return (new Array(0 | this.gameOptions.my)).map((e, i) => i)
    },
    buttonSize() {
      let minSize = Math.min(window.innerWidth, (window.innerHeight - 150))
      let maxBox = Math.max(this.gameOptions.mx, this.gameOptions.my)
      console.log(`min size=${minSize},screen size ${window.innerWidth} x ${window.innerHeight}`);
      return Math.floor(minSize / maxBox)
    }
  },
  watch: {
    'score.user': function(o) {
      if (this.score.user === this.gameOptions.maxScore) {
        clearInterval(this.interval)
        this.$refs['gameResult'].open();
        this.hardUp()
      }
    },
    'score.computer': function(o) {
      if (this.score.computer === this.gameOptions.maxScore) {
        clearInterval(this.interval)
        this.$refs['gameResult'].open();
      }
    }
  },
  methods: {
    hardUp() {
      this.gameOptions = {
        maxScore: this.gameOptions.maxScore + 1,
        mx: Math.min(this.gameOptions.mx + 1, 20),
        my: Math.min(this.gameOptions.my + 1, 20),
        timeout: Math.max(this.gameOptions.timeout - 500, 1500),
      }
    },
    getRandomArbitrary(max, min = 0) {
      return 0 | (Math.random() * (max - min) + min)
    },
    createRandom() {
      if (!this.gameStatus.clicked) this.updateScore(false)
      let x = this.getRandomArbitrary(this.gameOptions.mx)
      let y = this.getRandomArbitrary(this.gameOptions.my)
      this.gameStatus.current = {
        x,
        y
      }
      this.gameStatus.clicked = false
      console.log(this.gameStatus.current.x, this.gameStatus.current.y);
    },
    start() {
      this.gameStatus.clicked = true
      this.gameStatus.play = true
      this.createRandom()
      this.interval = setInterval(() => {
        this.createRandom()
      }, this.gameOptions.timeout);
    },
    stop() {
      console.log('interval cleared');
      this.gameStatus.play = false
      this.score.computer = 0
      this.score.user = 0
      clearInterval(this.interval)
    },
    updateScore(userWin) {
      if (this.gameStatus.clicked || !this.gameStatus.play) return false
      this.gameStatus.clicked = true
      if (userWin) this.score.user += 1
      else this.score.computer += 1
      this.gameStatus.current = {
        x: -1,
        y: -1
      }
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}

.wrapper {
  max-width: 800px;
  justify-content: center;
  flex-direction: row;
  margin: 0 auto;
}

.start-stop {
  margin: 10px auto !important;
}

.start-stop i {
  color: #fafafa !important;
}

.md-headline {
  display: block;
  text-align: center;
}
</style>
