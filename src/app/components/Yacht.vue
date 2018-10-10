<template>
  <section>
    <m-select :options="ingredients" class="mb-4" :select="changeIngredient" :value="ingredient"></m-select>
    <div class="units flex justify-between">
      <quantity :change="changeQuantity" :value="quantity"></quantity>
      <div class="mr-4"></div>
      <m-select placeholder="from" :options="units" class="mb-4" :select="changeFrom" :value="from" label="name"></m-select>
    </div>
    <div class="text-center mb-4">
      <button class="bg-transparent p-4" @click="invert">
        <svg
          class="w-10"
          viewBox="0 0 28.641 28.641">
          <g>
            <path d="M9.84,1.314l8.257,9.98c0,0,1.254,1.185-0.107,1.185s-4.655,0-4.655,0s0,0.797,0,2.026c0,3.509,0,9.9,0,12.497
              c0,0,0.188,0.705-0.885,0.705c-1.076,0-5.781,0-6.548,0c-0.768,0-0.747-0.588-0.747-0.588c0-2.531,0-9.133,0-12.53
              c0-1.1,0-1.817,0-1.817s-2.64,0-4.296,0S0.45,11.535,0.45,11.535S7.476,2.209,8.455,1.23C9.164,0.519,9.84,1.314,9.84,1.314z"/>
            <path d="M18.802,27.332l-8.259-9.978c0,0-1.25-1.188,0.109-1.188s4.65,0,4.65,0s0-0.802,0-2.027c0-3.511,0-9.899,0-12.498
              c0,0-0.181-0.708,0.89-0.708c1.074,0,5.781,0,6.546,0c0.768,0,0.747,0.592,0.747,0.592c0,2.528,0,9.136,0,12.526
              c0,1.101,0,1.819,0,1.819s2.641,0,4.298,0c1.654,0,0.406,1.238,0.406,1.238s-7.022,9.321-7.999,10.302
              C19.479,28.125,18.802,27.332,18.802,27.332z"/>
          </g>
        </svg>
      </button>
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
