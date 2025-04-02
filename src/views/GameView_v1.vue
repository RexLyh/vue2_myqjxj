<template>
  <div class="game-container">
    <h2>🪨 石头 | ✂️ 剪刀 | 🧻 布</h2>

    <div class="score-board">
      <div class="score">
        <span>你: {{ userScore }}</span>
        <span>电脑: {{ computerScore }}</span>
      </div>
      <div :class="['result', resultColor]">{{ gameResult }}</div>
    </div>

    <div class="choices">
      <el-button
        v-for="(choice, index) in choices"
        :key="index"
        type="primary"
        :class="['choice-btn', { shaking: isShaking }]"
        @click="playGame(choice)"
      >
        {{ choice }}
      </el-button>
    </div>

    <div class="selections">
      <div class="selection">
        <span>你的选择</span>
        <div :class="['icon', userChoice]" />
      </div>
      <div class="vs">VS</div>
      <div class="selection">
        <span>电脑选择</span>
        <div :class="['icon', computerChoice]" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      choices: ["🪨 石头", "✂️ 剪刀", "🧻 布"],
      userScore: 0,
      computerScore: 0,
      userChoice: "",
      computerChoice: "",
      gameResult: "点击按钮开始游戏",
      resultColor: "",
      isShaking: false,
    };
  },
  methods: {
    playGame(userChoice) {
      this.isShaking = true;
      const choiceMap = {
        "🪨 石头": "rock",
        "✂️ 剪刀": "scissors",
        "🧻 布": "paper",
      };

      this.userChoice = choiceMap[userChoice];
      const computerIndex = Math.floor(Math.random() * 3);
      this.computerChoice = choiceMap[this.choices[computerIndex]];

      setTimeout(() => {
        this.isShaking = false;
        this.calculateResult(userChoice, this.choices[computerIndex]);
      }, 1000);
    },

    calculateResult(user, computer) {
      const rules = {
        "🪨 石头": "✂️ 剪刀",
        "✂️ 剪刀": "🧻 布",
        "🧻 布": "🪨 石头",
      };

      if (user === computer) {
        this.gameResult = "平局！";
        this.resultColor = "neutral";
      } else if (rules[user] === computer) {
        this.userScore++;
        this.gameResult = "你赢了！🎉";
        this.resultColor = "win";
      } else {
        this.computerScore++;
        this.gameResult = "电脑赢了！💻";
        this.resultColor = "lose";
      }
    },
  },
};
</script>

<style scoped>
.game-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  text-align: center;
}

.score-board {
  margin: 2rem 0;
}

.score {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.result {
  font-size: 1.8rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.result.win {
  color: #4caf50;
  background: #e8f5e9;
}

.result.lose {
  color: #f44336;
  background: #ffebee;
}

.result.neutral {
  color: #2196f3;
  background: #e3f2fd;
}

.choices {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.choice-btn {
  font-size: 1.2rem;
  padding: 1rem 2rem;
  transition: transform 0.3s;
}

.shaking {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.selections {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon {
  width: 80px;
  height: 80px;
  background-size: contain;
  background-repeat: no-repeat;
}

.icon.rock {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%234CAF50" d="M18.5 12A3.5 3.5 0 0122 15.5 3.5 3.5 0 0118.5 19c-1.86 0-3.43-1.28-3.87-3H9.37c-.44 1.72-2.01 3-3.87 3A3.5 3.5 0 012 15.5 3.5 3.5 0 015.5 12h13M12 13a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1z"/></svg>');
}

.icon.scissors {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23FF9800" d="M20 21l-5-5 5-5v10M4 16l5-5-5-5v10m12-4a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2z"/></svg>');
}

.icon.paper {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%232196F3" d="M14 17H7V7h10v6h-3v4m-2-8h2m-2 4h2m-5-4h2m-2 4h2m5-5V5l5 5h-5z"/></svg>');
}
</style>
