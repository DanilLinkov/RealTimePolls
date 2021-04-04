import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import PollGraph from "../PollGraph/PollGraph";
import Moment from "react-moment";

const useStyles = makeStyles({});

const PollCard = (props) => {
  const { poll } = props;
  const history = useHistory();
  const classes = useStyles();

  return (
    <Grid item xs={6} style={{ height: "20em" }}>
      <Card style={{ backgroundColor: "#fbeeac", height: "100%" }}>
        <CardActionArea
          style={{
            height: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
          onClick={() => {
            history.push("/poll/" + poll._id);
          }}
        >
          <CardContent style={{ width: "100%" }}>
            <Container
              disableGutters={true}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1em",
              }}
            >
              <Typography color="textPrimary" variant="h5">
                {poll.title}
              </Typography>
              <Moment fromNow style={{ fontSize: 15 }}>
                {poll.dateCreated}
              </Moment>
            </Container>
            <PollGraph usePoll={poll} display={true} smallVersion={true} />
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default PollCard;
