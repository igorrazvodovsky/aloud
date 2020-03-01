<template>
  <div>
    <ul class="hs full no-scrollbar px-0">
      <v-card class="item" v-for="card in cards" :key="card.id" flat>
        <v-img :src="card.src" height="6rem" width="6rem"> </v-img>
      </v-card>
    </ul>
    <div class="subtitle-2 mx-4 mt-4">My Bookshelf →</div>
    <!-- EXPLORE -->
    <div class="explore my-4 pt-2 pb-12">
      <h2 class="display-1 mx-4 my-4 font-weight-bold primary--text">Explore</h2>
      <v-card flat class="explore-promo mx-4 mb-4">
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="headline primary--text"
              >Experience the macabre, biting satire</v-card-title
            >
            <v-card-subtitle></v-card-subtitle>
          </div>

          <v-avatar class="ma-3" size="125" tile>
            <v-img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSPUw8ew_mpIjINXsRKsVwKsj8RDmMcVBvAZQPTMP66-8cMyh3r"
            ></v-img>
          </v-avatar>
        </div>
      </v-card>
      <h3 class="title mx-4 my-4">
        New releases
      </h3>
      <ul class="hs full no-scrollbar px-0">
        <v-card class="item" v-for="card in cards" :key="card.title" flat>
          <v-img :src="card.src" height="6rem" width="6rem"> </v-img>
        </v-card>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    cards: [
      {
        id: 1,
        src: "https://www.storytel.com/images/200x200/0000627492.jpg",
      },
      {
        id: 2,
        src: "https://www.storytel.com/images/200x200/0000026621.jpg",
      },
      {
        id: 3,
        src: "https://www.storytel.com/images/200x200/0000029114.jpg",
      },
      {
        id: 4,
        src: "https://www.storytel.com/images/200x200/0000003828.jpg",
      },
      {
        id: 5,
        src: "https://www.storytel.com/images/200x200/0000003982.jpg",
      },
      {
        id: 6,
        src: "https://www.storytel.com/images/200x200/0000054902.jpg",
      }
    ]
  })
};
</script>
