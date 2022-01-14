<template>
  <div class="flex gap-4">
    <div class="mt-1 flex w-2/3 rounded-md shadow-sm">
      <input
        type="text"
        name="search"
        id="search"
        v-model="search"
        class="px-3 py-2 focus:ring-indigo-500 border outline-none focus:ring-1 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md placeholder:text-gray-400"
        placeholder="owner/repositoryName"
      />
    </div>

    <button
      @click="handleSubmit"
      class="flex flex-1 w-1/3 items-center bg-indigo-500 hover:bg-indigo-600 uppercase tracking-wider text-white w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Поиск
    </button>
  </div>
</template>

<script>
export default {
  name: "Search",

  computed: {
    // owner: {
    //   get() {
    //     return this.$route.query?.owner ?? "";
    //   },
    //   set(val) {
    //     console.log('set owner', val)
    //     this.$router.push({
    //       name: this.$route.name,
    //       query: Object.assign(
    //         {},
    //         { repositoryName: this.$route.query.repositoryName },
    //         { owner: val }
    //       ),
    //     });
    //   },
    // },
    // repositoryName: {
    //   get() {
    //     return this.$route.query?.repositoryName ?? "";
    //   },
    //   set(val) {
    //     console.log('set rep name', val)
    //     this.$router.push({
    //       name: this.$route.name,
    //       query: Object.assign(
    //         {},
    //         { owner: this.$route.query.owner },
    //         { repositoryName: val }
    //       ),
    //     });
    //   },
    // },
    search: {
      get() {
        return this.$route.query.repositoryName
          ? `${this.$route.query.owner}/${this.$route.query.repositoryName}`
          : this.$route.query.owner;
      },
      set(val) {
        console.log("search val", val);
        let res = val.split("/");
        let q = {};
        if (res[0]) {
          q = Object.assign(q, { owner: res[0] });
        }
        if (res[1]) {
          q = Object.assign(q, { repositoryName: res[1] });
        }
        this.$router.replace({ name: this.$route.name, query: q });
      },
    },
  },

  methods: {
    async handleSubmit() {
      this.$emit("search");
    },
  },
};
</script>
