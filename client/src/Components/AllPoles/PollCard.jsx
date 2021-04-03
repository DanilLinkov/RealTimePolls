import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import PollGraph from "../PollGraph/PollGraph";
import PollGrid from "./PollGrid";

const useStyles = makeStyles({});

const PollCard = (props) => {
  const { poll } = props;
  const history = useHistory();
  const classes = useStyles();

  return (
    <Grid item xs={6}>
      <Card style={{ backgroundColor: "#fbeeac" }}>
        <CardActionArea
          onClick={() => {
            history.push("/poll/" + poll._id);
          }}
        >
          <CardContent>
            <Typography color="textPrimary" variant="h5">
              {poll.title}
            </Typography>
            <PollGraph usePoll={poll} display={true} smallVersion={true} />
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default PollCard;
