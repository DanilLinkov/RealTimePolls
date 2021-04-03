import { Grid, Container, makeStyles } from "@material-ui/core";
import React from "react";
import VoteItem from "./VoteItem";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5em",
  },
}));

const VoteGrid = (props) => {
  const classes = useStyles();
  const { labels, useSelected, setSelected } = props;

  return (
    <Container className={classes.mainContainer}>
      <Grid container spacing={1}>
        {labels.map((label, index) => (
          <VoteItem
            onClick={setSelected}
            key={index}
            label={label}
            index={index}
            useSelected={useSelected}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default VoteGrid;
