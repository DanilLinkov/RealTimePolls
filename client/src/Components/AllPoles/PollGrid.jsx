import { Container, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import PollCard from "./PollCard";

const useStyles = makeStyles({});

const PollGrid = (props) => {
  const classes = useStyles();
  const { polls } = props;

  return (
    <Container
      style={{
        marginTop: "3em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={3}>
        {polls.map((poll, index) => (
          <PollCard key={index} poll={poll} />
        ))}
      </Grid>
    </Container>
  );
};

export default PollGrid;
