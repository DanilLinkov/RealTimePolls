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
  Typography,
  Popover,
  Box,
} from "@material-ui/core";
import PollService from "../Services/pollApi.js";
import PollGraph from "../Components/PollGraph/PollGraph.jsx";
import VoteGrid from "../Components/Vote/VoteGrid.jsx";
import { io } from "socket.io-client";
import Moment from "react-moment";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";

const ENDPOINT = "http://localhost:3000/";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#eac8af",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "1%",
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

  const [useDeleteLoading, setDeleteLoading] = React.useState(false);

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
  }, [id, props.history]);

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
            <div>
              <Button
                style={{
                  backgroundColor: "#fbeeac",
                  marginRight: hasCreated && "0.5em",
                }}
                variant="contained"
                onClick={() => props.history.push("/")}
              >
                Go back
              </Button>
            </div>
            <Typography
              style={{
                color: "#28527a",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginLeft: hasCreated ? "11%" : "1.5%",
              }}
              variant="h3"
            >
              {usePoll.title}
              <Moment
                fromNow
                style={{
                  fontSize: 15,
                  marginRight: "0.5em",
                }}
              >
                {usePoll.dateCreated}
              </Moment>
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
              <PopupState variant="popover">
                {(popupState) => (
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `http://localhost:3001/poll/${id}`
                      );
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: "#fbeeac",
                      }}
                      variant="contained"
                      {...bindTrigger(popupState)}
                    >
                      Copy link
                    </Button>
                    <Popover
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      style={{ marginTop: "0.5em" }}
                    >
                      <Box
                        p={2}
                        style={{
                          backgroundColor: "#28527a",
                        }}
                      >
                        <Typography
                          style={{ color: "#8ac4d0", fontSize: "1.1em" }}
                        >
                          Link coppied!
                        </Typography>
                      </Box>
                    </Popover>
                  </div>
                )}
              </PopupState>
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
                  marginLeft: "0.5em",
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
                  width: "96%",
                }}
                disableGutters={true}
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
              }}
            >
              Already Voted
            </Typography>
          ) : (
            <React.Fragment>
              <Typography
                variant="h6"
                style={{
                  color: "#28527a",
                  padding: "0.5em",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.7em",
                  marginBottom: "1em",
                }}
              >
                Select one of the options below and click vote to cast your vote
              </Typography>
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
                  backgroundColor: "#fbeeac",
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
              {useDeleteLoading ? (
                <div
                  style={{
                    marginBottom: "1em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <DialogActions>
                  <Button
                    autoFocus
                    style={{
                      backgroundColor: "#c64756",
                      marginRight: "0.5em",
                    }}
                    variant="contained"
                    onClick={() => {
                      handleClose();
                      setDeleteLoading(true);
                      PollService.deletePoll(id)
                        .then((response) => {
                          setDeleteLoading(false);
                          props.history.push("/");
                        })
                        .catch((e) => {
                          setDeleteLoading(false);
                        });
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
              )}
            </Container>
          </Dialog>
        </React.Fragment>
      ) : (
        <CircularProgress style={{ marginTop: "10%" }} />
      )}
    </Container>
  );
};

export default PollRoute;
