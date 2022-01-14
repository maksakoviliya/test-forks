<template>
  <div>
    <transition name="fade">
      <div
        class="fixed inset-0 z-20 bg-black bg-opacity-20"
        v-if="showModal"
        @click="$emit('close')"
      ></div>
    </transition>
    <transition name="fade-and-scale">
      <div
        v-if="showModal"
        class="z-30 fixed max-w-sm top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 py-4 max-h-screen overflow-auto"
      >
        <button
          class="absolute right-4 top-8 hover:text-gray-600 text-gray-400 w-8 h-8 inline-flex flex-col items-center justify-center hover:bg-gray-100 rounded-full"
          @click="$emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div class="card w-full mx-auto max-w-sm">
          <slot>Default modal content</slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Modal",

  props: {
    showModal: {
      default: false,
    },
  },
};
</script>

<style>
.fade-and-scale-enter-active {
  @apply transition ease-out duration-100;
}
.fade-and-scale-leave-active {
  @apply transition ease-out duration-100;
}
.fade-and-scale-enter {
  @apply transform opacity-0 scale-95;
}
.fade-and-scale-leave-to {
  @apply transform opacity-0 scale-95;
}
</style>
