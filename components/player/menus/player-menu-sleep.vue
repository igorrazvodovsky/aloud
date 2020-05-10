<script>
export default {
  props: ["open"],
  data: () => ({
    sleepCurrent: 15,
    sleepOptions: [15, 30, 45, 60]
  })
};
</script>
