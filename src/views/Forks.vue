<template>
  <div class="max-w-5xl mx-auto my-10">
    <search @search="fetch" />

    <transition name="fade">
      <div
          class="shadow overflow-auto mt-12 border-b border-gray-200 sm:rounded-lg"
          v-if="forks.length"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th
                scope="col"
                v-for="field in fields"
                :key="field.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ field.label }}
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" v-if="forks.length">
          <tr v-for="fork in forks" :key="fork.id">
            <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                v-for="field in fields"
                :key="field.key"
            >
              <template v-if="field.key === 'owner'">
                <a :href="fork.owner.html_url" class="flex items-center group">
                  <span class="block flex-shrink-0 h-10 w-10">
                    <img
                        class="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-indigo-500"
                        :src="fork.owner.avatar_url"
                        alt=""
                    />
                  </span>
                  <span class="ml-4">
                    <span
                        class="block text-sm font-medium text-gray-900 group-hover:text-indigo-700"
                    >
                      @{{ fork.owner.login }}
                    </span>
                    <!--                    <span class="block text-sm text-gray-500 group-hover:text-indigo-700">-->
                    <!--                      {{ jane.cooper@example.com }}-->
                    <!--                    </span>-->
                  </span>
                </a>
              </template>
              <template v-else-if="field.key === 'clone_url'">
                <a
                    :href="fork.clone_url"
                    class="inline text-gray-500 hover:text-gray-700"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </template>
              <template v-else-if="field.key === 'stargazers_count'">
                <div class="inline-flex gap-1 text-gray-500">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {{ fork.stargazers_count }}
                </div>
              </template>
              <template v-else>
                {{ fork[field.key] }}
              </template>
            </td>
          </tr>

          <!-- More people... -->
          </tbody>
        </table>

        <pagination :total="totalForks" class="p-4"></pagination>
      </div>
    </transition>
    <div
      class="text-gray-600 mt-10 text-lg text-center font-bold tracking-wide"
      v-if="!forks.length && !loading"
    >
      <div v-if="error" class="text-red-400">
        <h4 class="text-4xl">{{ error.status }}</h4>
        <p class="mt-4">
          {{ error.data.message }}
        </p>
      </div>
      <template v-else> Форков не найдено </template>
    </div>
    <!--    <div v-for="fork in forks" :key="fork.id">-->
    <!--      {{ fork }}-->
    <!--    </div>-->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";

export default {
  name: "Forks",

  data() {
    return {
      fields: [
        {
          key: "owner",
          label: "Владелец",
        },
        {
          key: "full_name",
          label: "Название",
        },
        {
          key: "stargazers_count",
          label: "Кол-во звезд",
        },
        {
          key: "clone_url",
          label: "Сслыка на fork",
        },
      ],
    };
  },

  watch: {
    "$route.query.page": {
      handler: function (page) {
        if (page) {
          this.fetch();
        }
      },
      deep: true,
    },
  },

  components: {
    Search,
    Pagination,
  },

  computed: {
    ...mapState(["forks", "totalForks", "loading", "error"]),
  },

  methods: {
    ...mapActions(["fetchRepoForks"]),
    fetch() {
      if (this.$route.query?.owner && this.$route.query?.repositoryName) {
        this.fetchRepoForks({
          owner: this.$route.query.owner,
          repositoryName: this.$route.query.repositoryName,
          page: this.$route.query?.page ?? 1,
          per_page: this.$route.query?.perPage ?? 10,
        });
      }
    },
  },

  mounted() {
    this.fetch();
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  @apply transition;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>