<template>
  <input
    v-model="value"
    class="border w-full h-full h-10 text-3xl p-4 mb-4 flex-1 text-center"
    type="number"
    placeholder="42"
    @keypress="isNumber" />
</template>

<script>
  export default {
    props: {
      change: {
        type: Function,
        required: true,
      },
    },
    data: () => {
      return {
        value: null,
      }
    },
    updated() {
      this.change(this.value);
    },
    methods: {
      isNumber(e) {
        e = e ? e : window.event;
        const charCode = e.which ? e.which : e.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          e.preventDefault();
          return false;
        } else return true;
      },
    }
  }
</script>
