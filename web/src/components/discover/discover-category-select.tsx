"use client";

import Select, { type StylesConfig } from "react-select";

export type CategorySelectOption = {
  value: string;
  label: string;
};

const brand = {
  navy: "#123669",
  teal: "#20a181",
  secondary: "#166ad8",
  muted: "#525252",
  border: "#1236691f",
  white: "#ffffff",
};

const categorySelectStyles: StylesConfig<CategorySelectOption, false> = {
  container: (base) => ({
    ...base,
    width: "100%",
  }),
  control: (base, state) => ({
    ...base,
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: brand.white,
    borderColor: state.isFocused ? brand.secondary : brand.border,
    boxShadow: state.isFocused ? "0 0 0 2px rgba(22, 106, 216, 0.3)" : "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    "&:hover": {
      borderColor: state.isFocused ? brand.secondary : brand.border,
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "2px 12px",
  }),
  singleValue: (base) => ({
    ...base,
    color: brand.navy,
  }),
  placeholder: (base) => ({
    ...base,
    color: brand.muted,
  }),
  input: (base) => ({
    ...base,
    color: brand.navy,
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: brand.muted,
    paddingRight: 12,
    transition: "transform 0.2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
    "&:hover": {
      color: brand.navy,
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 8,
    border: `1px solid ${brand.border}`,
    boxShadow: "0 10px 15px -3px rgba(18, 54, 105, 0.1)",
    overflow: "hidden",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: 4,
    maxHeight: 280,
  }),
  option: (base, state) => ({
    ...base,
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 6,
    cursor: "pointer",
    color: brand.navy,
    backgroundColor: state.isSelected
      ? "rgba(32, 161, 129, 0.15)"
      : state.isFocused
        ? "rgba(18, 54, 105, 0.05)"
        : brand.white,
    "&:active": {
      backgroundColor: "rgba(32, 161, 129, 0.2)",
    },
  }),
};

type DiscoverCategorySelectProps = {
  inputId: string;
  value: string;
  options: CategorySelectOption[];
  onChange: (slug: string) => void;
};

export function DiscoverCategorySelect({
  inputId,
  value,
  options,
  onChange,
}: DiscoverCategorySelectProps) {
  const selected =
    options.find((option) => option.value === value) ?? options[0] ?? null;

  if (options.length === 0) {
    return (
      <p className="text-sm text-muted" id={inputId}>
        No categories available.
      </p>
    );
  }

  return (
    <Select<CategorySelectOption, false>
      inputId={inputId}
      instanceId={inputId}
      options={options}
      value={selected}
      onChange={(option) => {
        if (option) onChange(option.value);
      }}
      isSearchable={false}
      styles={categorySelectStyles}
      classNamePrefix="discover-category"
      aria-label="Browse by category"
      menuPlacement="auto"
      menuPortalTarget={
        typeof document !== "undefined" ? document.body : undefined
      }
      menuPosition="fixed"
    />
  );
}
