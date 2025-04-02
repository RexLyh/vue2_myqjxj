<template>
  <div class="game-container">
    <h2 class="title">🐶 动物记忆大挑战 🐱</h2>

    <div class="game-header">
      <div class="timer">剩余时间: {{ timeLeft }}秒</div>
      <div class="score">已匹配: {{ matchedPairs }} 对</div>
      <el-button type="danger" @click="resetGame" size="mini"
        >重新开始</el-button
      >
    </div>

    <div class="cards-grid">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card"
        :class="{
          flipped: card.flipped,
          matched: card.matched,
        }"
        @click="flipCard(index)"
      >
        <div class="card-front">?</div>
        <div class="card-back">{{ card.emoji }}</div>
      </div>
    </div>

    <el-dialog
      :visible.sync="showResult"
      :title="gameResult.title"
      width="30%"
      center
    >
      <span>{{ gameResult.message }}</span>
      <span slot="footer">
        <el-button type="primary" @click="resetGame">再玩一次</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const animals = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

export default {
  data() {
    return {
      cards: [],
      flippedIndexes: [],
      matchedPairs: 0,
      timeLeft: 60,
      timer: null,
      showResult: false,
      isProcessing: false,
    };
  },
  computed: {
    gameResult() {
      return this.matchedPairs === 8
        ? {
            title: "游戏胜利",
            message: `🎉 太棒了！用时 ${60 - this.timeLeft} 秒`,
          }
        : { title: "时间到", message: `😢 已匹配 ${this.matchedPairs} 对` };
    },
  },
  created() {
    this.initGame();
    this.startTimer();
  },
  methods: {
    initGame() {
      // 生成卡牌对并洗牌
      const cards = [...animals, ...animals]
        .map((emoji) => ({ emoji, flipped: false, matched: false }))
        .sort(() => Math.random() - 0.5);

      this.cards = cards;
    },
    flipCard(index) {
      if (
        this.isProcessing ||
        this.cards[index].matched ||
        this.flippedIndexes.includes(index)
      )
        return;

      this.cards[index].flipped = true;
      this.flippedIndexes.push(index);

      if (this.flippedIndexes.length === 2) {
        this.checkMatch();
      }
    },
    checkMatch() {
      this.isProcessing = true;
      const [first, second] = this.flippedIndexes;

      if (this.cards[first].emoji === this.cards[second].emoji) {
        this.cards[first].matched = true;
        this.cards[second].matched = true;
        this.matchedPairs++;
        this.flippedIndexes = [];
        this.isProcessing = false;

        if (this.matchedPairs === 8) {
          this.endGame();
        }
      } else {
        setTimeout(() => {
          this.cards[first].flipped = false;
          this.cards[second].flipped = false;
          this.flippedIndexes = [];
          this.isProcessing = false;
        }, 800);
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft <= 0) {
          this.endGame();
          return;
        }
        this.timeLeft--;
      }, 1000);
    },
    endGame() {
      clearInterval(this.timer);
      this.showResult = true;
    },
    resetGame() {
      clearInterval(this.timer);
      this.timeLeft = 60;
      this.matchedPairs = 0;
      this.flippedIndexes = [];
      this.showResult = false;
      this.initGame();
      this.startTimer();
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="less">
.game-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin: 0 auto;
}

.card {
  aspect-ratio: 1;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;

  &.flipped {
    transform: rotateY(180deg);
  }

  &.matched {
    opacity: 0.6;
    cursor: default;
    // 新增：匹配成功后保持翻转状态
    transform: rotateY(180deg);

    .card-back {
      transform: unset;
    }
  }
}

.card-front {
  background: #3498db;
  color: white;
  z-index: 1;

  .matched& {
    display: none;
  }
}

.card-back {
  background: #f1c40f;
  transform: rotateY(180deg);
  z-index: 2; // 确保背面始终在上层
}

// 删除重复的.card-front定义
.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5em;
  backface-visibility: hidden;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}
</style>
