<template>
  <div>
    <div class="bg-white flex items-center justify-between">
      <!--      <div class="flex-1 flex justify-between sm:hidden">-->
      <!--        <a-->
      <!--          href="#"-->
      <!--          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"-->
      <!--        >-->
      <!--          Previous-->
      <!--        </a>-->
      <!--        <a-->
      <!--          href="#"-->
      <!--          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"-->
      <!--        >-->
      <!--          Next-->
      <!--        </a>-->
      <!--      </div>-->
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-xs text-gray-700">
            c
            {{ " " }}
            <span class="font-bold">{{ page * perPage - perPage + 1 }}</span>
            {{ " " }}
            по
            {{ " " }}
            <span class="font-bold" v-if="canMoveNext">{{
              page * perPage
            }}</span>
            <span class="font-bold" v-else>{{
              (total % perPage) + (page - 1) * perPage
            }}</span>
            {{ " " }}
            из
            {{ " " }}
            <span class="font-bold">{{ total }}</span>
            {{ " " }}
            результатов
          </p>
        </div>
        <div v-if="totalPages > 1">
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <router-link
              :to="{
                name: $route.name,
                params: $route.params,
                query: Object.assign({}, $route.query, { page: page - 1 }),
              }"
              :class="
                canMovePrev
                  ? 'bg-white hover:bg-gray-50'
                  : 'pointer-events-none bg-gray-100'
              "
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-100 text-xs font-medium text-gray-500"
            >
              <span class="sr-only">Previous</span>
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </router-link>
            <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
            <router-link
              v-for="(item, i) in paginationTriggers"
              :to="{
                name: $route.name,
                params: $route.params,
                query: Object.assign({}, $route.query, { page: item }),
              }"
              :key="`item_${i}`"
              aria-current="page"
              :class="[
                parseInt(String(item)) === parseInt(page)
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-800'
                  : 'border border-gray-100 text-gray-500 hover:bg-gray-50',
                item === '...' ? 'pointer-events-none' : '',
              ]"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium"
            >
              {{ item }}
            </router-link>
            <router-link
              :to="{
                name: $route.name,
                params: $route.params,
                query: Object.assign({}, $route.query, { page: page + 1 }),
              }"
              :class="
                canMoveNext
                  ? 'bg-white hover:bg-gray-50'
                  : 'pointer-events-none bg-gray-100'
              "
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-100 text-xs font-medium text-gray-500"
            >
              <span class="sr-only">Next</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",

  props: {
    total: {
      default: 0,
    },
  },

  computed: {
    page() {
      return this.$route.query.page ?? 1;
    },
    perPage() {
      return this.$route.query["perPage"] ?? 10;
    },
    totalPages() {
      return Math.ceil(parseInt(this.total) / parseInt(this.perPage));
    },
    canMovePrev() {
      return parseInt(this.page) > 1;
    },
    canMoveNext() {
      return parseInt(this.page) !== this.totalPages;
    },
    paginationTriggers() {
      const currentPage = this.page;
      const pageCount = this.totalPages;
      if (pageCount < 5) {
        const paginationTriggersArray = Array(pageCount).fill(0);
        return paginationTriggersArray.map((paginationTrigger, index) => {
          return paginationTriggersArray[0] + index + 1;
        });
      }
      const visiblePagesCount = 5;
      const visiblePagesThreshold = (visiblePagesCount - 1) / 2;
      const paginationTriggersArray = Array(visiblePagesCount - 1).fill(0);

      if (currentPage <= visiblePagesThreshold + 1) {
        paginationTriggersArray[0] = 1;
        const paginationTriggers = paginationTriggersArray.map(
          (paginationTrigger, index) => {
            return paginationTriggersArray[0] + index;
          }
        );
        paginationTriggers.push("...");
        paginationTriggers.push(pageCount);
        return paginationTriggers;
      }

      if (currentPage >= pageCount - visiblePagesThreshold) {
        const paginationTriggers = paginationTriggersArray.map(
          (paginationTrigger, index) => {
            return pageCount - index;
          }
        );
        paginationTriggers.push("...");
        paginationTriggers.reverse().unshift(1);
        return paginationTriggers;
      }

      paginationTriggersArray[0] = currentPage - visiblePagesThreshold + 1;
      const paginationTriggers = paginationTriggersArray.map(
        (paginationTrigger, index) => {
          return paginationTriggersArray[0] + index;
        }
      );
      paginationTriggers.unshift("...");
      paginationTriggers.unshift(1);
      if (pageCount - currentPage > visiblePagesThreshold) {
        paginationTriggers.push("...");
        paginationTriggers[paginationTriggers.length] = pageCount;
      }
      return paginationTriggers;
    },
  },
};
</script>
