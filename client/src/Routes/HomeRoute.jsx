import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import PollService from "../Services/pollApi.js";
import PollGrid from "../Components/AllPoles/PollGrid.jsx";
import SearchBar from "../Components/PollSearch/SearchBar.jsx";

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

  const [useSearchLoading, setSearchLoading] = React.useState(false);

  const [usePollFilter, setPollFilter] = React.useState("");
  const [usePollGridLoading, setPollGridLoading] = React.useState("");

  React.useEffect(() => {
    PollService.getPolls().then((response) => {
      setPolls(response);
    });
  }, []);

  const onSearchSubmit = () => {
    setSearchLoading(true);
    PollService.getPollById(useSearch.trim())
      .then((response) => {
        setSearchLoading(false);
        if (response !== undefined) {
          console.log(response.data);
          props.history.push("/poll/" + useSearch);
        } else {
          setError("Invalid poll ID");
        }
      })
      .catch((e) => {
        setSearchLoading(false);
        setError("Invalid poll ID");
      });
  };

  return (
    <Container className={classes.mainContainer} maxWidth="md">
      <img
        src={require("../CreateAPoll1.svg").default}
        alt="mySvgImage"
        width={200}
        height={200}
        style={{ margin: -80 }}
      />
      <div
        style={{
          backgroundColor: "#8ac4d0",
          width: "100%",
          height: "0.3em",
          marginTop: "2em",
        }}
      ></div>
      <Container className={classes.searchMainContainer} maxWidth="md">
        <Typography style={{ margin: "1em" }} variant="h6">
          Enter a valid poll ID and click "GO" to proceed to the poll.
        </Typography>
        <Container className={classes.searchBarContainer}>
          <TextField
            style={{
              height: "3.9em",
              width: "50%",
              backgroundColor: "#8ac4d0",
            }}
            label="Enter a valid poll ID"
            variant="filled"
            autoComplete="off"
            onChange={(event) => setSearch(event.target.value)}
          />
          {useSearchLoading ? (
            <div style={{ marginLeft: "1em", width: "10%" }}>
              <CircularProgress />
            </div>
          ) : (
            <Button
              style={{
                marginLeft: "1em",
                height: "3.9em",
                width: "10%",
                backgroundColor: "#fbeeac",
              }}
              variant="contained"
              onClick={() => onSearchSubmit()}
            >
              Go
            </Button>
          )}
        </Container>
        {useError === "" ? null : (
          <Typography style={{ margin: "1em", color: "#8ac4d0" }} variant="h6">
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
          backgroundColor: "#fbeeac",
        }}
        variant="contained"
        onClick={() => props.history.push("/createapoll")}
      >
        Create A Poll
      </Button>
      <div
        style={{
          backgroundColor: "#8ac4d0",
          width: "100%",
          height: "0.3em",
          marginTop: "2em",
        }}
      ></div>
      <Typography
        style={{
          marginTop: "1.5em",
          marginLeft: "1.25em",
          alignSelf: "flex-start",
        }}
        variant="h6"
      >
        Participate in public polls:
      </Typography>
      <SearchBar
        useSearch={usePollFilter}
        setSearch={setPollFilter}
        setPollGridLoading={setPollGridLoading}
      />
      {usePolls && !usePollGridLoading ? (
        <PollGrid polls={usePolls} pollFilter={usePollFilter} />
      ) : (
        <CircularProgress style={{ marginTop: "10%" }} />
      )}
    </Container>
  );
};

export default HomeRoute;
