const columns = {
  data() {
    return {
      columns: [
        {
          text: "# of Levels",
          value: "active_level_count",
          edit: "false",
          sortBy: "active_level_count",
        },
        {
          text: "Building ID",
          value: "ref_id",
          edit: "true",
          sortBy: "ref_id",
        },
        {
          text: "Building Name",
          value: "name",
          edit: "false",
          sortBy: "name",
        },
        {
          text: "Building Subtotal",
          value: "skup_subtotal",
          edit: "false",
          sortBy: "skup_subtotal",
        },
        {
          text: "Building Total",
          value: "skup_total",
          edit: "false",
          sortBy: "skup_total",
        },
        {
          text: "Building Type",
          value: "building_type",
          edit: "true",
          sortBy: "building_type__option_name",
        },
        {
          text: "Combined # of Levels",
          value: "level_count",
          edit: "false",
          sortBy: "level_count",
        },
        {
          text: "Country",
          value: "country",
          edit: "false",
          sortBy: "country",
        },
        {
          text: "Inactive # of Levels",
          value: "inactive_level_count",
          edit: "false",
          sortBy: "inactive_level_count",
        },
        {
          text: "Notes",
          value: "notes",
          edit: "false",
          sortBy: "notes",
        },
        {
          text: "Primary Address",
          value: "full_address",
          edit: "false",
          sortBy: "full_address",
        },
        {
          text: "Redacted # of Levels",
          value: "redacted_level_count",
          edit: "false",
          sortBy: "redacted_level_count",
        },
        {
          text: "Secondary Information",
          value: "secondary_information",
          edit: "false",
          sortBy: "secondary_information",
        },
        {
          text: "State",
          value: "state",
          edit: "false",
          sortBy: "state",
        },
      ],
      usedColumns: [],
    };
  },

  methods: {
    filterColumns(arrColumns) {
      this.usedColumns = this.columns.filter((column) => {
        return arrColumns.indexOf(column.value) !== -1;
      });
      this.usedColumns = this.usedColumns.map((column) => {
        return {
          ...column,
          divider: true,
          resizable: true,
          class: "resize-header-cell",
          width: "200px",
        };
      });
    },
  },
};

export default columns;
