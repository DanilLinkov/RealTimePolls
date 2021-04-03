import axios from "axios";

const API_URL = "http://localhost:3000/poll";

class PollService {
  getPollById(id) {
    return axios.get(API_URL + `/${id}`).then((response) => {
      return response.data;
    });
  }

  getPolls() {
    return axios.get(API_URL).then((response) => {
      return response.data;
    });
  }

  createPoll(title, description, options) {
    return axios.post(API_URL, {
      title,
      description,
      options,
    });
  }

  deletePoll(id) {
    return axios.delete(API_URL + `/${id}`).then((response) => {
      return response.data;
    });
  }
}

export default new PollService();
