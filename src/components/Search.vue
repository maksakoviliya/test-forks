<template>
  <div class="grid grid-cols-1 gap-6">
    <div class="mt-1 flex rounded-md shadow-sm">
      <input
        type="text"
        name="search"
        id="search"
        v-model="search"
        class="px-3 py-2 focus:ring-indigo-500 border outline-none focus:ring-1 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md placeholder:text-gray-400"
        placeholder="Владелец репозитория"
      />
    </div>

    <div>
      <label for="owner" class="block text-sm font-medium text-gray-700">
        Owner
      </label>
      <div class="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          name="owner"
          id="owner"
          v-model="owner"
          class="px-3 py-2 focus:ring-indigo-500 border outline-none focus:ring-1 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md placeholder:text-gray-400"
          placeholder="Владелец репозитория"
        />
      </div>
    </div>
    <div>
      <label for="repo" class="block text-sm font-medium text-gray-700">
        Repository Name
      </label>
      <div class="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          name="repo"
          v-model="repositoryName"
          id="repo"
          class="px-3 py-2 focus:ring-indigo-500 border outline-none focus:ring-1 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md placeholder:text-gray-400"
          placeholder="Название репозитория"
        />
      </div>
    </div>

    <button
      @click="handleSubmit"
      class="flex bg-indigo-400 hover:bg-indigo-500 uppercase tracking-wider text-white w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Поиск
    </button>
  </div>
</template>

<script>
export default {
  name: "Search",

  computed: {
    owner: {
      get() {
        return this.$route.query?.owner ?? "";
      },
      set(val) {
        this.$router.push({
          name: this.$route.name,
          query: Object.assign(
            {},
            { repositoryName: this.$route.query.repositoryName },
            { owner: val }
          ),
        });
      },
    },
    repositoryName: {
      get() {
        return this.$route.query?.repositoryName ?? "";
      },
      set(val) {
        this.$router.push({
          name: this.$route.name,
          query: Object.assign(
            {},
            { owner: this.$route.query.owner },
            { repositoryName: val }
          ),
        });
      },
    },
    search: {
      get() {
        return `${this.owner}/${this.repositoryName}`;
      },
      set(val) {
        this.owner = val.substr(
          0,
          val.indexOf("/") === -1 ? val.length : val.indexOf("/")
        );
        this.repositoryName = val.substr(val.indexOf("/")+1, val.length);
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
