import React from "react";
import Select from "react-select";

function SelectInput(props) {
  const { error } = props;
  return (
    <div>
      <Select
        isClearable={false}
        isSearchable={false}
        // formatCreateLabel={(userInput) => `${userInput} (Add New Address)`}
        {...props}
      />
      {error ? (
        <p style={{ paddingTop: 5, fontSize: 13, color: "red" }}>{error}</p>
      ) : null}
    </div>
  );
}

export default SelectInput;
