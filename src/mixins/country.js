const country = {
  data() {
    return {
      country: [
        { text: "United States of America", value: "US" },
        { text: "Albania", value: "Al" },
        { text: "Brazil", value: "BR" },
      ],
    };
  },
  computed: {
    getCountries: () => {
      return this.country;
    },
  },
};

export default country;
