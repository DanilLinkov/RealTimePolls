import { TextField } from "@material-ui/core";
import React from "react";

const SearchBar = (props) => {
  const { setSearch, setPollGridLoading } = props;
  let searchTimeOut;

  const onChange = (event) => {
    setPollGridLoading(true);
    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => {
      setSearch(event.target.value);
      setPollGridLoading(false);
    }, 500);
  };

  return (
    <TextField
      onChange={(event) => onChange(event)}
      style={{
        height: "3.9em",
        width: "50%",
        backgroundColor: "#8ac4d0",
        marginTop: "2em",
        marginBottom: "1em",
      }}
      label="Search for a poll title"
      variant="filled"
      autoComplete="off"
    />
  );
};

export default SearchBar;
