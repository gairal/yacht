<template>
  <section class="w-full h-full flex flex-col justify-between">
    <m-select :options="ingredients" class="mb-4" :select="changeIngredient" :value="ingredient"></m-select>
    <div class="units flex justify-between flex-1 mb-4">
      <quantity :change="changeQuantity" :value="quantity"></quantity>
      <div class="mr-4"></div>
      <m-select placeholder="from" :options="units" :select="changeFrom" :value="from" label="name"></m-select>
    </div>
    <button class="bg-transparent p-4 mb-4 flex-1 h-0 h-full" @click="invert">
      <img class="max-h-full" src="img/icons/revert.svg" alt="revert" />
    </button>
    <m-select placeholder="to" :options="units" class="mb-4" :select="changeTo" :value="to" label="name"></m-select>
    <p class="text-center text-8xl md:text-10xl p-4 overflow-hidden" :class="{ 'border-b': res !== '' }">
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
      invert() {
        const tmp = this.from;
        this.from = this.to;
        this.to = tmp;
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
