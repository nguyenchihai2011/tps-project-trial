import axios from "axios";

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
    filterColumns(column_setting) {
      this.usedColumns = column_setting.columns.map((value) =>
        this.columns.find((column) => column.value === value)
      );
      this.usedColumns = this.usedColumns.map((column, index) => {
        return {
          ...column,
          divider: true,
          resizable: true,
          width: column_setting.column_sizes
            ? column_setting.column_sizes[index + 1] + "px"
            : "auto",
        };
      });
    },

    settingColumns(column_setting) {
      return this.columns.filter((column) => {
        return column_setting.columns.indexOf(column.value) !== -1;
      });
    },
  },
};

export default columns;
