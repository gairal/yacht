<template>
  <section>
    <m-select :options="ingredients" class="mb-4" :select="changeIngredient" :value="ingredient"></m-select>
    <div class="units flex justify-between flex-col md:flex-row">
      <quantity :change="changeQuantity" :value="quantity"></quantity>
      <div class="mr-4 hidden md:block"></div>
      <m-select placeholder="from" :options="units" class="mb-4" :select="changeFrom" :value="from"></m-select>
    </div>
    <div class="text-center mb-4">
      <svg
        width="6rem"
        viewBox="0 0 220.682 220.682">
        <g>
          <polygon points="110.341,220.682 210.043,120.98 181.758,92.695 110.341,164.113 38.924,92.695 10.639,120.98 	"/>
          <polygon points="210.043,28.284 181.758,0 110.341,71.418 38.924,0 10.639,28.284 110.341,127.986 	"/>
        </g>
      </svg>
    </div>
    <m-select placeholder="to" :options="units" class="mb-4" :select="changeTo" :value="to"></m-select>
    <p class="text-center text-10xl p-4 overflow-hidden" :class="{ 'bg-grey-light': res !== '' }">
      {{ res }}
    </p>
  </section>
</template>

<script>
  import Quantity from './Quantity';
  import Select from './Select';

  export default {
    components: {
      mSelect: Select,
      Quantity,
    },
    data: () => {
      return {
        ratios: {},
        units: [],
        ingredients: [],
        res: '',
        ingredient: '',
        from: '',
        to: '',
        quantity: null,
      }
    },
    created() {
      fetch('./db/yacht.json')
        .then(d => d.json())
        .then(db => {
          this.units = db.units;
          this.ingredients = db.ingredients;
          this.ratios = db.ratios;
          this.convert();
        })
        .catch(e => console.error(e));
    },
    mounted() {
      if (localStorage.yacht) {
        try {
          const def = JSON.parse(localStorage.yacht);
          this.quantity = def.quantity;
          this.from = def.from;
          this.to = def.to;
          this.ingredient = def.ingredient;
        } catch (e) {
          console.error(e);
        }
      }
    },
    methods: {
      save() {
        const { ingredient, from, to, quantity } = this;
        localStorage.yacht = JSON.stringify({
          ingredient,
          from,
          to,
          quantity,
        });
      },
      changeQuantity(qty) {
        this.quantity = qty;
        this.convert();
      },
      changeFrom(from) {
        this.from = from;
        this.convert();
      },
      changeTo(to) {
        this.to = to;
        this.convert();
      },
      changeIngredient(ingredient) {
        this.ingredient = ingredient;
        this.convert();
      },
      convert() {
        this.res = '';

        if (
          !this.ratios
          || !this.quantity
          || !this.from
          || !this.to) return;
        this.save();

        const fromRatios = this.ratios[this.from];
        if (!fromRatios) return;
        let ratio = fromRatios[this.to];
        if (!ratio) return;

        if (isNaN(ratio)) {
          ratio = 1;
        }

        this.res = Math.round(this.quantity * ratio * 100) / 100;
      }
    },
  }
</script>
