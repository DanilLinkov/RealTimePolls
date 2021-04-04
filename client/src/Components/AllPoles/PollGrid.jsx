import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import PollCard from "./PollCard";

const useStyles = makeStyles({});

const PollGrid = (props) => {
  const classes = useStyles();
  const { polls, pollFilter } = props;

  const foundPolls = polls.find((poll) =>
    poll.title.trim().toLowerCase().includes(pollFilter.trim().toLowerCase())
  );

  return (
    <Container
      style={{
        marginTop: "1.5em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={3}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {foundPolls !== undefined
          ? polls.map(
              (poll, index) =>
                poll.isPublic &&
                poll.title
                  .trim()
                  .toLowerCase()
                  .includes(pollFilter.trim().toLowerCase()) && (
                  <PollCard key={index} poll={poll} />
                )
            )
          : pollFilter !== "" && (
              <Typography
                variant="h6"
                style={{ fontSize: "1.2em", marginTop: "3em" }}
              >
                No polls were found for this search input
              </Typography>
            )}
      </Grid>
    </Container>
  );
};

export default PollGrid;
