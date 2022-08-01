<script>
export default {
  created() {
    const { params, query } = this.$route;
    const { path } = params;
    this.$router.replace({ path: "/" + path, query });
    console.log("建立了");
  },
  render: function (h) {
    return h(); // avoid warning message
  },
};
</script>
