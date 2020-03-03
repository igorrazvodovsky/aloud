<template>
<div>
  <v-card class="search-results" style="top: 4rem" :ripple="false">
    <h2 class="subtitle-2 ma-4">Top</h2>
    <div class="d-flex ma-2">
      <v-avatar tile size="56" color="grey" class="ma-2">
        <img
          src="https://www.storytel.com/images/200x200/0000021260.jpg"
          alt="Wolf Hall"
        />
      </v-avatar>
      <div class="ma-2">
        <h3 class="title">Wolf Hall</h3>
        <span class="body-2 grey--text"
          ><v-icon small>mdi-ear-hearing</v-icon> by Hilary Mantel, with Dan
          Stevens</span
        >
      </div>
    </div>

    <div class="d-flex ma-2">
      <v-avatar tile size="56" color="grey" class="ma-2 series">
        <img
          src="https://www.storytel.com/images/200x200/0001022025.jpg"
          alt="Wolf Hall Trilogy"
        />
      </v-avatar>
      <div class="ma-2">
        <h3 class="title">The Wolf Hall Trilogy</h3>
        <span class="body-2 grey--text">by Hilary Mantel</span>
      </div>
    </div>
  </v-card>

  <v-card class="search-results" style="top: 82%" :ripple="false">
    <h2 class="subtitle-2 ma-4">Books</h2>
  </v-card>
  <v-card class="search-results" style="top: 91%" :ripple="false">
    <h2 class="subtitle-2 ma-4">Authors</h2>
  </v-card>

</div>
</template>
