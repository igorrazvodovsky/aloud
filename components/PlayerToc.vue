<template>
  <v-list dense dark>
    <v-list-item-group v-model="current">
      <template v-for="(item, index) in items">
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-title v-text="item.chapter"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text v-text="item.time"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list-item-group>
  </v-list>
</template>
<script>
export default {
  data: () => ({
    current: [2],
    items: [
      {
        chapter: "Chapter 1",
        time: "00:00"
      },
      {
        chapter: "Chapter 2",
        time: "15:56"
      },
      {
        chapter: "Chapter 3",
        time: "27:12"
      },
      {
        chapter: "Chapter 4",
        time: "45:44"
      },
      {
        chapter: "Chapter 5",
        time: "15:56"
      },
      {
        chapter: "Chapter 6",
        time: "27:12"
      },
      {
        chapter: "Chapter 7",
        time: "56:12"
      },
      {
        chapter: "Chapter 8",
        time: "15:56"
      },
      {
        chapter: "Chapter 9",
        time: "27:12"
      },
      {
        chapter: "Chapter 10",
        time: "00:00"
      },
      {
        chapter: "Chapter 11",
        time: "15:56"
      },
      {
        chapter: "Chapter 12",
        time: "27:12"
      }
    ]
  })
};
</script>
