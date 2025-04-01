<template>
  <div class="progress-container">
    <svg :width="size" :height="size">
      <circle
        class="background"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
      />
      <circle
        class="progress"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
      />
    </svg>
    <div class="progress-text">{{ formattedProgress }}%</div>
    <div class="controls">
      <button @click="togglePause">
        {{ isAnimating ? (isPaused ? "继续" : "暂停") : "开始" }}
      </button>
      <button @click="reset">重置</button>
      <div class="speed-control">
        <label>速度调节：{{ speed }}x</label>
        <input
          type="range"
          v-model.number="speed"
          min="0.1"
          max="3"
          step="0.1"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 0,
      isAnimating: false,
      isPaused: false,
      size: 200,
      strokeWidth: 10,
      speed: 1, // 新增速度控制参数（1表示正常速度）
      startTime: null, // 新增动画开始时间戳
      pausedProgress: 0, // 新增暂停时的进度
      pausedDuration: 0, // 新增已消耗的时间
    };
  },
  computed: {
    radius() {
      return this.size / 2 - this.strokeWidth;
    },
    center() {
      return this.size / 2;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    offset() {
      return this.circumference * (1 - this.progress / 100);
    },
    // 添加格式化后的进度值
    formattedProgress() {
      return this.progress.toFixed(0); // 修改为保留0位小数
    },
    // 新增计算属性
    computedDuration() {
      return 3000 / this.speed; // 根据速度计算动画时长
    },
  },
  methods: {
    startAnimation() {
      if (this.progress >= 100) return;

      this.isAnimating = true;
      this.isPaused = false;
      // 修复1：记录准确的开始时间
      this.startTime = Date.now() - this.pausedDuration;

      const animate = () => {
        if (!this.isPaused) {
          const elapsed = Date.now() - this.startTime;
          const progress = Math.min(elapsed / this.computedDuration, 1);

          // 使用二次缓动函数（加速后减速）
          const easedProgress =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          this.progress = Math.min(easedProgress * 100, 100);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            this.isAnimating = false;
            this.$alert("Done!", "提示", {
              confirmButtonText: "确定",
            });
          }
        }
      };
      requestAnimationFrame(animate);
    },
    togglePause() {
      if (!this.isAnimating) {
        this.startAnimation();
        return;
      }

      if (!this.isPaused) {
        // 修复2：准确记录暂停时刻的持续时间
        this.pausedDuration = Date.now() - this.startTime;
      } else {
        // 修复3：重置开始时间为当前时间减去已持续时间
        this.startTime = Date.now() - this.pausedDuration;
      }
      this.isPaused = !this.isPaused;

      // 修复4：继续时主动触发动画帧
      if (!this.isPaused) {
        requestAnimationFrame(this.startAnimation);
      }
    },
    reset() {
      // 重置时清除暂停相关数据
      this.pausedProgress = 0;
      this.pausedDuration = 0;
      this.progress = 0;
      this.isAnimating = false;
      this.isPaused = false;
    },
  },
};
</script>

<style scoped>
.progress-container {
  position: relative;
  display: inline-block;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
}

circle.background {
  stroke: #eee;
  fill: none;
}

circle.progress {
  stroke: #409eff;
  fill: none;
  transition: stroke-dashoffset 0.1s linear;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.controls {
  margin-top: 20px;
  text-align: center;
}

button {
  margin: 0 5px;
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.speed-control {
  margin-top: 15px;
}

.speed-control input[type="range"] {
  width: 200px;
  margin-top: 5px;
}

.speed-control label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}
</style>
