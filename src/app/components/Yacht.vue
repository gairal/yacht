<template>
  <section>
    <m-select :options="ingredients" class="mb-4" :select="changeIngredient" :value="ingredient"></m-select>
    <div class="units flex justify-between flex-col md:flex-row">
      <quantity :change="changeQuantity" :value="quantity"></quantity>
      <div class="mr-4 hidden md:block"></div>
      <m-select placeholder="from" :options="units" class="mb-4" :select="changeFrom" :value="from" label="name"></m-select>
    </div>
    <div class="text-center mb-4">
      <svg
        class="w-10"
        viewBox="0 0 220.682 220.682">
        <g>
          <polygon points="110.341,220.682 210.043,120.98 181.758,92.695 110.341,164.113 38.924,92.695 10.639,120.98 	"/>
          <polygon points="210.043,28.284 181.758,0 110.341,71.418 38.924,0 10.639,28.284 110.341,127.986 	"/>
        </g>
      </svg>
    </div>
    <m-select placeholder="to" :options="units" class="mb-4" :select="changeTo" :value="to" label="name"></m-select>
    <p class="text-center text-5xl md:text-10xl p-4 overflow-hidden" :class="{ 'bg-grey-light': res !== '' }">
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
          || !this.to
          || !this.ingredient) return;
        this.save();
        let res = 0;

        // First check we have our from and to ratii
        const fromRatio = this.ratios[this.from.type][this.from.name];
        const toRatio = this.ratios[this.to.type][this.to.name];
        if (!fromRatio || !toRatio) return;

        // Transform the value to base unit (l or g)
        res = this.quantity * 1 / fromRatio;

        if (this.from.type !== this.to.type) {
          // Conversion weight to volume or inverse
          let ingredientRatio = this.ratios.ingredients[this.ingredient];
          if (!ingredientRatio) return;
          if (isNaN(ingredientRatio)) {
            ingredientRatio = this.ratios.ingredients[ingredientRatio];
          }

          if (this.from.type === 'volume') {
            // conversion from grams to liters
            res = res * ingredientRatio;
          } else {
            // conversion from liters to grams
            res = res * 1 / ingredientRatio;
          }
        }

        // Then transform the base unit to the expected unit
        res = res * toRatio;

        this.res = res ? Math.round(res * 1000) / 1000 : '';
      }
    },
  }
</script>
