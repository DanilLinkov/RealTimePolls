import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import PollService from "../Services/pollApi.js";
import PollGrid from "../Components/AllPoles/PollGrid.jsx";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#8ac4d0",
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
  searchMainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const HomeRoute = (props) => {
  const classes = useStyles();

  const [useSearch, setSearch] = React.useState("");
  const [useError, setError] = React.useState("");

  const [usePolls, setPolls] = React.useState();

  React.useEffect(() => {
    PollService.getPolls().then((response) => {
      setPolls(response);
    });
  });

  const onSearchSubmit = () => {
    PollService.getPollById(useSearch)
      .then((response) => {
        if (response.data !== null) {
          props.history.push("/poll/" + useSearch);
        }
      })
      .catch((e) => {
        setError("Invalid poll ID");
      });
  };

  return (
    <Container className={classes.mainContainer} maxWidth="md">
      <Container className={classes.searchMainContainer} maxWidth="md">
        <Typography style={{ margin: "1em" }} variant="h6">
          Please enter a valid poll ID in and click search or press enter.
        </Typography>
        <Container className={classes.searchBarContainer}>
          <TextField
            style={{ height: "100%", width: "50%", backgroundColor: "#fbeeac" }}
            label="Enter a valid poll ID"
            variant="filled"
            autoComplete="off"
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button
            style={{
              marginLeft: "1em",
              height: "100%",
              width: "10%",
              backgroundColor: "#f4d160",
            }}
            variant="contained"
            onClick={() => onSearchSubmit()}
          >
            Search
          </Button>
        </Container>
        {useError === "" ? null : (
          <Typography style={{ margin: "1em", color: "#c64756" }} variant="h6">
            {useError}
          </Typography>
        )}
      </Container>
      <Typography style={{ margin: "1em" }} variant="h6">
        ━━OR━━
      </Typography>
      <Button
        style={{
          marginLeft: "1em",
          height: "10%",
          width: "30%",
          backgroundColor: "#f4d160",
        }}
        variant="contained"
        onClick={() => props.history.push("/createapoll")}
      >
        Create A Poll
      </Button>
      {usePolls && <PollGrid polls={usePolls} />}
    </Container>
  );
};

export default HomeRoute;
