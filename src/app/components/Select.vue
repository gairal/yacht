<template>
  <multiselect
    v-model="val"
    @select="select"
    :options="options"
    :searchable="true"
    :close-on-select="true"
    :allow-empty="false"
    :label="label"
    :placeholder="placeholder ? placeholder : undefined">
    </multiselect>
</template>

<script>
  import Multiselect from 'vue-multiselect';

  export default {
    props: {
      placeholder: {
        type: String,
        required: false,
      },
      options: {
        type: Array,
        required: true,
      },
      select: {
        type: Function,
        required: true,
      },
      label: {
        type: String,
        required: false,
        default: null,
      },
      value: {
        required: false,
        default: null,
      },
    },
    components: {
      Multiselect
    },
    data: () => {
      return {
        init: false,
        val: null,
      }
    },
    watch: {
      value(val, old) {
        if (old) this.val = val;
      },
    },
    beforeUpdate() {
      if (this.init) return;
      if (this.value) {
        this.val = this.value;
        this.init = true;
      } else if (!this.placeholder && this.options.length) {
        this.val = this.options[0];
        this.init = true;
        this.select(this.val);
      }
    }
  }
</script>
