<template>
  <div class="max-w-4xl mx-auto my-10">
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
                  <a
                    :href="fork.owner.html_url"
                    class="flex items-center group"
                  >
                    <span class="block flex-shrink-0 h-10 w-10">
                      <img
                        class="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-indigo-500"
                        :src="fork.owner.avatar_url"
                        alt=""
                      />
                    </span>
                    <span
                      class="ml-4 block text-sm font-medium text-gray-900 group-hover:text-indigo-700"
                    >
                      @{{ fork.owner.login }}
                    </span>
                  </a>
                </template>
                <template v-else-if="field.key === 'clone_url'">
                  <a
                    :href="fork.clone_url"
                    class="flex w-9 mx-auto rounded-full items-center p-2 hover:bg-gray-100 justify-center text-gray-500 hover:text-indigo-700"
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
                  <div class="flex justify-center gap-1 text-gray-500">
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
                <template v-else-if="field.key === 'favorite'">
                  <button
                    @click="showFavoriteModal(fork.id)"
                    class="flex justify-center items-center p-2 mx-auto gap-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-700"
                  >
                    <svg
                      v-if="favorite.includes(fork.id)"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      v-else
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </template>
                <template v-else>
                  {{ fork[field.key] }}
                </template>
              </td>
            </tr>
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
    <div
      class="flex gap-2 items-center justify-center mt-10 mx-auto"
      v-if="loading"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span class="text-4xl font-extrabold text-gray-300 tracking-widest"
        >Loading...</span
      >
    </div>

    <modal :show-modal="showModal" @close="hideFavoriteModal">
      <template v-if="!favorite.includes(active)">
        <div>
          Добавить в избранное?
          <div class="grid grid-cols-2 gap-4 mt-4">
            <button
              class="rounded-md px-4 py-2 w-full border-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition"
              @click="hideFavoriteModal"
            >
              Отменить
            </button>
            <button
              @click="addToFavorite"
              class="rounded-md px-4 py-2 w-full bg-green-50 text-gray-600 hover:text-gray-900 hover:bg-green-100 transition"
            >
              Добавить
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          Удалить из избранного?
          <div class="grid grid-cols-2 gap-4 mt-4">
            <button
              class="rounded-md px-4 py-2 w-full border-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition"
              @click="hideFavoriteModal"
            >
              Отменить
            </button>
            <button
              @click="removeFromFavorite"
              class="rounded-md px-4 py-2 w-full bg-red-50 text-gray-600 hover:text-gray-900 hover:bg-red-100 transition"
            >
              Удалить
            </button>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";

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
        {
          key: "favorite",
          label: "Избранное",
        },
      ],
      showModal: false,
      active: null,
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
    Modal,
  },

  computed: {
    ...mapState(["forks", "totalForks", "loading", "error", "favorite"]),
  },

  methods: {
    ...mapActions(["fetchRepoForks"]),
    ...mapMutations(["ADD_TO_FAVORITE", "REMOVE_FROM_FAVORITE"]),
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
    showFavoriteModal(id) {
      this.active = id;
      this.showModal = true;
    },
    hideFavoriteModal() {
      this.active = null;
      this.showModal = false;
    },
    addToFavorite() {
      this.ADD_TO_FAVORITE(this.active);
      this.hideFavoriteModal();
    },
    removeFromFavorite() {
      this.REMOVE_FROM_FAVORITE(this.active);
      this.hideFavoriteModal();
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
  @apply transition duration-300;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
