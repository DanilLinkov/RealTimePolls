import React from "react";
import { Grid, Button } from "@material-ui/core";

const VoteItem = (props) => {
  const { onClick, label, index, useSelected } = props;

  const onButtonClick = () => {
    onClick(index);
  };

  const colors = [
    "#157F1F",
    "#4CB963",
    "#A0EADE",
    "#3C91E6",
    "#1D263B",
    "#FE7F2D",
    "#880044",
    "#DD1155",
    "#98A6D4",
    "#64403E",
  ];

  const isSelected = useSelected === index;

  const buttonStyle = isSelected
    ? {
        width: "100%",
        height: "100%",
        backgroundColor: colors[index],
      }
    : {
        width: "100%",
        height: "100%",
      };

  return (
    <Grid
      item
      xs={6}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Button
        onClick={onButtonClick}
        style={buttonStyle}
        variant={isSelected ? "contained" : "outlined"}
      >
        {label}
      </Button>
    </Grid>
  );
};

export default VoteItem;
