import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import PollService from "../Services/pollApi.js";
import PollGraph from "../Components/PollGraph/PollGraph.jsx";
import VoteGrid from "../Components/Vote/VoteGrid.jsx";
import { io } from "socket.io-client";

const ENDPOINT = "https://create-a-poll-server.herokuapp.com/";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#8ac4d0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "1%",
    marginTop: "5%",
    paddingTop: "2em",
    paddingBottom: "10em",
    borderRadius: "5em",
    marginBottom: "1%",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  graphContainer: {
    margin: "3em",
    marginBottom: "2em",
  },
}));

const socket = io(ENDPOINT, {
  transports: ["websocket", "polling", "flashsocket"],
});

const PollRoute = (props) => {
  const { id } = props.match.params;

  const classes = useStyles();
  const [usePoll, setPoll] = React.useState();
  const [useSelected, setSelected] = React.useState(0);

  const creatorOfPolls = JSON.parse(localStorage.getItem("created"));
  const votedOnPolls = JSON.parse(localStorage.getItem("votedOn"));

  const hasCreated =
    creatorOfPolls !== null && creatorOfPolls.find((pollId) => pollId === id);
  const hasVoted =
    votedOnPolls !== null && votedOnPolls.find((pollId) => pollId === id);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    socket.emit("joinPoll", id);

    PollService.getPollById(id)
      .then((response) => {
        if (response === null) {
          props.history.push("/");
        } else {
          setPoll(response);
        }
      })
      .catch((e) => {
        props.history.push("/");
      });
  }, []);

  React.useEffect(() => {
    if (usePoll) {
      const upvoteOption = ({ optionId }) => {
        const oldPoll = { ...usePoll };
        oldPoll.options.find((option) => option._id === optionId)
          .numberOfVotes++;
        setPoll(oldPoll);
      };
      socket.on("updatedPoll", upvoteOption);

      return () => {
        socket.off("updatedPoll", upvoteOption);
      };
    }
  }, [usePoll]);

  const onVote = () => {
    const optionId = usePoll.options[useSelected]._id;
    socket.emit("updatePoll", { id, optionId });

    const oldPoll = { ...usePoll };
    oldPoll.options[useSelected].numberOfVotes++;
    setPoll(oldPoll);

    if (votedOnPolls === null) {
      localStorage.setItem("votedOn", JSON.stringify([id]));
    } else {
      if (!hasVoted) {
        votedOnPolls.push(id);
        localStorage.setItem("votedOn", JSON.stringify(votedOnPolls));
      }
    }
  };

  return (
    <Container className={classes.mainContainer} maxWidth="md">
      {usePoll !== undefined ? (
        <React.Fragment>
          <Container className={classes.titleContainer} maxWidth="md">
            <Button
              style={{
                backgroundColor: "#f4d160",
              }}
              variant="contained"
              onClick={() => props.history.push("/")}
            >
              Go back
            </Button>
            <Typography
              style={{
                color: "#28527a",
              }}
              variant="h3"
            >
              {usePoll.title}
            </Typography>
            <div>
              {hasCreated && (
                <Button
                  style={{
                    backgroundColor: "#c64756",
                    marginRight: "0.5em",
                  }}
                  variant="contained"
                  onClick={() => handleClickOpen()}
                >
                  Delete
                </Button>
              )}
              <Button
                style={{
                  backgroundColor: "#f4d160",
                }}
                variant="contained"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `http://localhost:3001/poll/${id}`
                  );
                }}
              >
                Copy link
              </Button>
            </div>
          </Container>
          <Container className={classes.graphContainer}>
            <PollGraph usePoll={usePoll} display={true} />
          </Container>
          {usePoll.description !== undefined &&
          usePoll.description !== null &&
          usePoll.description.trim().length > 0 ? (
            <React.Fragment>
              <Typography
                variant="body1"
                style={{
                  color: "#28527a",
                  padding: "0.5em",
                  marginLeft: "1.1em",
                  fontSize: 20,
                  flexWrap: "wrap",
                  alignSelf: "flex-start",
                }}
              >
                Description:
              </Typography>
              <Container
                style={{
                  borderRadius: "0.5em",
                  backgroundColor: "#28527a",
                  marginBottom: "2em",
                }}
              >
                <Typography
                  variant="body1"
                  style={{
                    color: "#8ac4d0",
                    padding: "0.5em",
                    fontSize: 20,
                    flexWrap: "wrap",
                  }}
                >
                  {usePoll.description}
                </Typography>
              </Container>
            </React.Fragment>
          ) : null}
          {hasVoted ? (
            <Typography
              variant="h3"
              style={{
                color: "#28527a",
                padding: "0.5em",
                borderRadius: "0.5em",
              }}
            >
              Already Voted
            </Typography>
          ) : (
            <React.Fragment>
              <VoteGrid
                labels={usePoll.options.map((option) => option.name)}
                useSelected={useSelected}
                setSelected={setSelected}
              />
              <Button
                style={{
                  marginLeft: "1em",
                  height: "10%",
                  width: "30%",
                  backgroundColor: "#f4d160",
                }}
                variant="contained"
                onClick={() => onVote()}
              >
                Vote
              </Button>
            </React.Fragment>
          )}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <Container style={{ backgroundColor: "#28527a" }}>
              <DialogTitle
                id="responsive-dialog-title"
                style={{ color: "#8ac4d0" }}
              >
                {"Are you sure you want to delete this poll?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText style={{ color: "#8ac4d0" }}>
                  Deleting this poll is an ireversible action therefore proceed
                  carefully.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  autoFocus
                  style={{
                    backgroundColor: "#c64756",
                    marginRight: "0.5em",
                  }}
                  variant="contained"
                  onClick={() => {
                    PollService.deletePoll(id);
                    props.history.push("/");
                  }}
                >
                  Delete
                </Button>
                <Button
                  autoFocus
                  onClick={handleClose}
                  style={{
                    backgroundColor: "#f4d160",
                    marginRight: "0.5em",
                  }}
                  variant="contained"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Container>
          </Dialog>
        </React.Fragment>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default PollRoute;
