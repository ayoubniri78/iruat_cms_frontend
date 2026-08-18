<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Decorative tape strips -->
      <div class="relative">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#FFFACD] border border-black/20 rotate-1 z-10"></div>
        <div class="absolute -top-3 left-8 w-16 h-5 bg-[#FFE4E1] border border-black/20 -rotate-2 z-10"></div>
      </div>

      <!-- Card -->
      <div
        class="relative bg-white border-4 border-black p-8 pt-10 -rotate-[0.5deg]"
        style="box-shadow: 6px 6px 0px 0px #000;"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
