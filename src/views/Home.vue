<template>
  <div class="max-w-md mx-auto mt-60">
    <search @search="handleSearch" />
  </div>
</template>

<script>
import Search from "@/components/Search";
import { mapActions } from "vuex";

export default {
  name: "Home",

  components: {
    Search,
  },

  methods: {
    ...mapActions(["fetchRepoForks"]),
    async handleSearch() {
      await this.fetchRepoForks({
        owner: this.$route.query.owner,
        repositoryName: this.$route.query.repositoryName,
      });
      await this.$router.push({ name: "Forks", query: this.$route.query });
    },
  },
};
</script>
