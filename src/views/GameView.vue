<template>
  <div class="game-container">
    <!-- 标题添加动画 -->
    <h2 class="title animate__animated animate__bounceInDown">
      ✂️ 石头剪刀布 ✂️
    </h2>

    <!-- 比分牌添加跳动动画 -->
    <div class="score-board">
      <div
        class="scores animate__animated"
        :class="{ animate__heartBeat: scoreUpdated }"
      >
        <div class="score-item user">
          <span class="label">你</span>
          <span class="value">{{ userScore }}</span>
        </div>
        <div class="vs">VS</div>
        <div class="score-item computer">
          <span class="label">电脑</span>
          <span class="value">{{ computerScore }}</span>
        </div>
      </div>
      <!-- 结果提示添加动画 -->
      <transition name="slide-fade">
        <div :class="['result', resultType]" v-if="showResult">
          {{ gameResult }}
        </div>
      </transition>
    </div>

    <!-- 选择区域 -->
    <div class="choices">
      <div
        v-for="(choice, index) in choices"
        :key="index"
        :class="[
          'choice',
          { active: selectedIndex === index, disabled: isProcessing },
        ]"
        @click="selectChoice(index)"
      >
        <div class="icon-container">
          <div class="icon-shadow"></div>
          <div :class="['icon', choice.class]"></div>
        </div>
        <span class="choice-name">{{ choice.name }}</span>
      </div>
    </div>

    <!-- 电脑选择动画 -->
    <div class="computer-choice" :class="{ active: showComputerChoice }">
      <div class="thinking" v-if="isComputerThinking">🤔</div>
      <div class="icon-container" v-else>
        <div class="icon" :class="computerChoiceClass"></div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="danger" @click="resetGame" icon="el-icon-refresh-left"
        >重玩</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      choices: [
        { class: "rock", name: "石头", beats: "scissors" },
        { class: "scissors", name: "剪刀", beats: "paper" },
        { class: "paper", name: "布", beats: "rock" },
      ],
      userScore: 0,
      computerScore: 0,
      selectedIndex: -1,
      computerChoice: null,
      isProcessing: false,
      isComputerThinking: false,
      showResult: false,
      resultType: "neutral",
      scoreUpdated: false,
      showComputerChoice: false,
    };
  },
  computed: {
    computerChoiceClass() {
      return this.computerChoice ? this.computerChoice.class : "";
    },
    gameResult() {
      const results = {
        win: "胜利！🎉",
        lose: "失败...😢",
        draw: "平局 🤝",
      };
      return results[this.resultType] || "点击选择开始游戏";
    },
  },
  methods: {
    // 添加延时工具方法
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    async selectChoice(index) {
      if (this.isProcessing) return;

      this.selectedIndex = index;
      this.isProcessing = true;
      this.showResult = false;

      // 电脑思考动画
      this.isComputerThinking = true;
      this.showComputerChoice = true;
      await this.delay(1000); // 修改为使用本地delay方法

      // 生成电脑选择
      const randomIndex = Math.floor(Math.random() * 3);
      this.computerChoice = this.choices[randomIndex];
      this.isComputerThinking = false;

      // 展示结果
      await this.delay(500); // 修改这里
      this.calculateResult(index, randomIndex);

      // 重置状态
      await this.delay(2000); // 修改这里
      this.resetRound();
    },

    calculateResult(userIndex, computerIndex) {
      const userChoice = this.choices[userIndex];
      const computerChoice = this.choices[computerIndex];

      if (userChoice.beats === computerChoice.class) {
        this.userScore++;
        this.resultType = "win";
        this.playSound("win");
      } else if (computerChoice.beats === userChoice.class) {
        this.computerScore++;
        this.resultType = "lose";
        this.playSound("lose");
      } else {
        this.resultType = "draw";
        this.playSound("draw");
      }

      this.showResult = true;
      this.animateScore();
    },

    animateScore() {
      this.scoreUpdated = true;
      setTimeout(() => {
        this.scoreUpdated = false;
      }, 500);
    },

    playSound(type) {
      console.log(type);
      return;
      // const audio = new Audio();
      // audio.src = {
      //   win: "/sounds/win.mp3",
      //   lose: "/sounds/lose.mp3",
      //   draw: "/sounds/draw.mp3",
      // }[type];
      // audio.play();
    },

    resetRound() {
      this.selectedIndex = -1;
      this.computerChoice = null;
      this.showComputerChoice = false;
      this.isProcessing = false;
    },

    resetGame() {
      this.userScore = 0;
      this.computerScore = 0;
      this.resetRound();
      this.showResult = false;
    },
  },
};
</script>

<style scoped lang="less">
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .title {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* 比分牌样式 */
  .scores {
    display: flex;
    align-items: center;
    gap: 3rem;
    padding: 1.5rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    .score-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1.8rem;

      .label {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 0.5rem;
      }

      .value {
        font-weight: bold;
        color: #2c3e50;
      }
    }
  }

  /* 选择按钮样式 */
  .choices {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin: 3rem 0;

    .choice {
      cursor: pointer;
      transition: all 0.3s;
      position: relative;

      &:hover:not(.disabled) {
        transform: translateY(-5px);

        .icon-container {
          transform: scale(1.1);
        }
      }

      &.active {
        .icon-container {
          box-shadow: 0 0 25px rgba(66, 185, 131, 0.3);
        }
      }
    }
  }

  .icon-container {
    width: 120px;
    height: 120px;
    background: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    position: relative;

    .icon {
      width: 60%;
      height: 60%;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      &.rock {
        background-image: url("@/assets/rock.png");
      }
      &.scissors {
        background-image: url("@/assets/scissors.png");
      }
      &.paper {
        background-image: url("@/assets/paper.png");
      }
    }
  }

  /* 电脑选择区域 */
  .computer-choice {
    margin-top: 2rem;
    opacity: 0;
    transition: all 0.3s;

    &.active {
      opacity: 1;
    }

    .thinking {
      font-size: 3rem;
      animation: thinking 1s infinite;
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .choices {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .icon-container {
      width: 100px;
      height: 100px;
    }
  }
}

/* 动画定义 */
@keyframes thinking {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
