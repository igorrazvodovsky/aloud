import Vue from "vue";

Vue.filter("MMSSTimeFormat", function(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
});

Vue.filter("fancyTimeFormat", function(s) {
  let sec_num = parseInt(s, 10);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  if (hours > 0) return hours + " hr " + minutes + " min";
  else return minutes + " min";
});

Vue.filter("fixedDecimal", function(x) {
  return Number.parseFloat(x).toFixed(1);
});
