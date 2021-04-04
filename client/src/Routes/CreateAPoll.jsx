import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Checkbox,
} from "@material-ui/core";
import PollService from "../Services/pollApi.js";

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
  textInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    width: "65%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "3em",
  },
  optionContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
}));

const BlueCheckBox = withStyles({
  root: {
    color: "#28527a",
    "&$checked": {
      color: "#28527a",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const CreateAPoll = (props) => {
  const classes = useStyles();

  const [useTitle, setTitle] = React.useState("");
  const [useDesc, setDesc] = React.useState("");
  const [useOptions, setOptions] = React.useState(["", ""]);
  const [useIsPublic, setIsPublic] = React.useState(true);

  const [useTitleError, setTitleError] = React.useState(false);
  const [useOptionsError, setOptionsError] = React.useState(false);

  const [useLoading, setLoading] = React.useState(false);

  const onSubmit = () => {
    setLoading(true);
    const cleanOptions = getCleanOptions();

    if (checkInput(cleanOptions) === true) {
      PollService.createPoll(useTitle, useDesc, cleanOptions, useIsPublic)
        .then((response) => {
          setLoading(false);
          const id = response.data._id;
          const creatorOfPolls = JSON.parse(localStorage.getItem("created"));

          if (creatorOfPolls === null) {
            localStorage.setItem("created", JSON.stringify([id]));
          } else {
            creatorOfPolls.push(id);
            localStorage.setItem("created", JSON.stringify(creatorOfPolls));
          }

          props.history.push("/poll/" + id);
        })
        .catch((e) => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const checkInput = (cleanOptions) => {
    const titleError =
      useTitle === null ||
      useTitle === undefined ||
      useTitle.trim().length < 2 ||
      useTitle.trim().length > 20;
    const optionsError =
      cleanOptions.length < 2 ||
      cleanOptions.find((option) => option.trim().length > 20);

    setTitleError(titleError);
    setOptionsError(optionsError);

    if (titleError || optionsError) {
      return false;
    } else {
      return true;
    }
  };

  const getCleanOptions = () => {
    const cleanOptions = [];

    for (let i = 0; i < useOptions.length; i++) {
      if (useOptions[i].trim().length > 0) {
        cleanOptions.push(useOptions[i]);
      }
    }

    return cleanOptions;
  };

  const onChangeOption = (newOptionText, optionNum) => {
    const newOptions = [...useOptions];
    newOptions[optionNum] = newOptionText;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (useOptions.length < 10) {
      const newOptions = [...useOptions];
      newOptions.push("");
      setOptions(newOptions);
    }
  };

  const removeOption = (optionNum) => {
    if (useOptions.length > 0) {
      const newOptions = [...useOptions];
      newOptions.splice(optionNum, 1);
      setOptions(newOptions);
    }
  };

  const renderOption = (option, optionNum) => {
    return (
      <Container className={classes.optionContainer} key={optionNum}>
        <TextField
          style={{ width: "100%", height: "100%", backgroundColor: "#fbeeac" }}
          label={`Option ${optionNum + 1}`}
          variant="filled"
          autoComplete="off"
          value={useOptions[optionNum]}
          onChange={(event) => {
            onChangeOption(event.target.value, optionNum);
          }}
          error={useOptionsError}
        />
        <Button
          style={{
            padding: "1.11em",
            width: "18%",
            backgroundColor: "#c64756",
            marginLeft: "0.1em",
          }}
          variant="contained"
          onClick={() => removeOption(optionNum)}
          disabled={useOptions.length < 3}
        >
          Remove
        </Button>
      </Container>
    );
  };

  return (
    <Container className={classes.mainContainer} maxWidth="md">
      <Container className={classes.textInfoContainer} maxWidth="md">
        <Typography style={{ margin: "1em" }} variant="h6">
          Create a poll by filling out the information below and clicking
          "Confirm"
        </Typography>
        <Container className={classes.titleContainer}>
          <Typography
            variant="h6"
            style={{ alignSelf: "flex-start", marginBottom: "0.5em" }}
          >
            Title
          </Typography>
          <TextField
            style={{ width: "100%", backgroundColor: "#fbeeac" }}
            label="Enter a title for the poll"
            variant="filled"
            autoComplete="off"
            onChange={(event) => setTitle(event.target.value)}
            error={useTitleError}
          />
          {useTitleError && (
            <Typography
              style={{
                margin: "1em",
                color: "#c64756",
                fontSize: 16,
                fontWeight: "bold",
                extAlign: "center",
              }}
            >
              Please enter a title that is between 1 and 20 characters in
              length.
            </Typography>
          )}
          <Typography
            variant="h6"
            style={{
              alignSelf: "flex-start",
              marginBottom: "0.5em",
              marginTop: "1em",
            }}
          >
            Description (optional)
          </Typography>
          <TextField
            style={{
              width: "100%",
              backgroundColor: "#fbeeac",
            }}
            multiline={true}
            rows={5}
            label="Enter a description for the poll"
            variant="filled"
            autoComplete="off"
            onChange={(event) => setDesc(event.target.value)}
          />
        </Container>
      </Container>
      <Container className={classes.titleContainer}>
        <Typography style={{ margin: "1em" }} variant="h6">
          ━━OPTIONS━━
        </Typography>
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            marginBottom: "1em",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <Typography variant="h6" style={{ fontSize: "1.2em" }}>
              Make public?
            </Typography>
            <BlueCheckBox
              checked={useIsPublic}
              onChange={() => setIsPublic(!useIsPublic)}
              name="checkedB"
              color="primary"
            />
          </div>
          <Typography>(public polls will show up on the home page)</Typography>
        </Container>
        {useOptions.map((option, index) => renderOption(option, index))}
        {useOptionsError && (
          <Typography
            style={{
              margin: "1em",
              color: "#c64756",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Please enter at least 2 options which are between 1 and 20
            characters in length.
          </Typography>
        )}
        <Button
          style={{
            height: "3em",
            width: "100%",
            backgroundColor: "#fbeeac",
            marginTop: "0.5em",
          }}
          variant="contained"
          onClick={() => addOption()}
          disabled={useOptions.length > 9}
        >
          Add option
        </Button>
      </Container>
      {useLoading ? (
        <CircularProgress style={{ marginTop: "3em" }} />
      ) : (
        <Container className={classes.buttonContainer}>
          <Button
            style={{
              height: "10%",
              width: "30.7%",
              backgroundColor: "#5eaaa8",
            }}
            variant="contained"
            onClick={() => onSubmit()}
          >
            Confirm
          </Button>
          <Button
            style={{
              marginLeft: "1em",
              height: "10%",
              width: "30.7%",
              backgroundColor: "#c64756",
            }}
            variant="contained"
            onClick={() => props.history.goBack()}
          >
            Cancel
          </Button>
        </Container>
      )}
    </Container>
  );
};

export default CreateAPoll;
