<template>
  <v-list>
    <v-list-item-group>
      <template v-for="(item, index) in items">
        <v-list-item :three-line="item.note ? true : false" :key="index">
          <v-list-item-content>
            <v-list-item-title v-text="item.chapter"></v-list-item-title>
            <v-list-item-subtitle v-html="item.note"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text
              v-text="item.time"
            ></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list-item-group>
  </v-list>
</template>
<script>
export default {
  data: () => ({
    items: [
      {
        chapter: "Previous position • 03:55:02",
        time: "1 min"
      },
      {
        chapter: "Chapter 1 • 05:02",
        time: "15:26"
      },
      {
        chapter: "Chapter 1 • 07:16",
        time: "Tuesday",
        note:
          "A little before the age of Cæsar, the Germans, abusing their superiority of valor, had occupied a considerable portion of the Belgic territory."
      },
      {
        chapter: "Chapter 3 • 01:25:51",
        time: "28 Jan",
        note:
          "Musical style changes as a function of larger cultural change…changes in an operatic style as a function of the music as a mirror…"
      },
      {
        chapter: "Chapter 5 • 01:55:15",
        time: "28 Jan"
      },
      {
        chapter: "Chapter 5 • 02:01:11",
        time: "28 Jan"
      },
      {
        chapter: "Chapter 6 • 02:30:00",
        time: "28 Jan"
      },
      {
        chapter: "Chapter 7 • 02:56:45",
        time: "28 Jan"
      },
      {
        chapter: "Chapter 8 • 03:01:02",
        time: "27 January"
      }
    ]
  })
};
</script>
