<template>
  <section>
    <m-select :options="ingredients" class="mb-4" :select="changeIngredient" :value="ingredient"></m-select>
    <div class="units flex justify-between flex-col md:flex-row">
      <m-select placeholder="from" :options="units" class="mb-4" :select="changeFrom" :value="from"></m-select>
      <div class="mr-4 hidden md:block"></div>
      <m-select placeholder="to" :options="units" class="mb-4" :select="changeTo" :value="to"></m-select>
    </div>
    <quantity :change="changeQuantity" :value="quantity"></quantity>
    <p class="text-center text-10xl p-4" :class="{ 'bg-grey-light': res !== '' }">
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
        this.converse();
      },
      changeFrom(from) {
        this.from = from;
        this.converse();
      },
      changeTo(to) {
        this.to = to;
        this.converse();
      },
      changeIngredient(ingredient) {
        this.ingredient = ingredient;
        this.converse();
      },
      converse() {
        if (
          !this.ratios
          || !this.quantity
          || !this.from
          || !this.to) return;
        this.save();
      }
    },
  }
</script>
