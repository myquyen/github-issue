import React from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "./App.css";
import moment from "moment";
// import users from "./components/users";

const clientId = process.env.REACT_APP_CLIENT_ID;
class App extends React.Component {
  constructor(props) {
    super(props);

    const existingToken = sessionStorage.getItem("token");
    const accessToken =
      window.location.search.split("=")[0] === "?access_token"
        ? window.location.search.split("=")[1]
        : null;

    if (!accessToken && !existingToken) {
      window.location.replace(
        `https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${clientId}`
      );
    }

    if (accessToken) {
      console.log(`New accessToken: ${accessToken}`);

      sessionStorage.setItem("token", accessToken);
      this.state = {
        token: accessToken,
        issues: [],
        filteredIssues: []
      };
    }

    if (existingToken) {
      this.state = {
        token: existingToken,
        issues: [],
        filteredIssues: []
      };
    }
  }

  fetchIssues = async repoName => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/facebook/${repoName}/issues`
      );
      const data = await response.json();
      // console.log("DATA", data);
      this.setState({ issues: data, filteredIssues: data });
    } catch (error) {
      this.setState({ error });
    }
  };

  componentDidMount() {
    document.addEventListener("DOMContentLoaded", function() {
      var elems = document.querySelectorAll(".modal");
      var instances = M.Modal.init(elems);
    });
    this.fetchIssues("react");
  }

  searchRepo = () => {
    let repoName = document.getElementById("searchRepo").value;
    // console.log("REPOOOOOO", repo);
    this.fetchIssues(repoName);
  };

  searchIssues = term => {
    let filteredIssues = this.state.issues.filter(issue =>
      issue.title.toLowerCase().includes(term.toLowerCase())
    );
    this.setState({ filteredIssues });
  };

  render() {
    console.log("STATE", this.state);
    if (false) {
      return <div />;
    } else {
      return (
        <div>
          <div id="modal1" class="modal">
            <div class="modal-content">
              <h4>Modal Header</h4>
              <p>A bunch of text</p>
            </div>
            <div class="modal-footer">
              <a
                href="#!"
                class="modal-close waves-effect waves-green btn-flat"
              >
                Agree
              </a>
            </div>
          </div>
          <nav>
            <div class="nav-wrapper">
              <form>
                <div class="input-field">
                  <input
                    onChange={e => this.searchIssues(e.target.value)}
                    id="search"
                    type="search"
                    required
                  />
                  <label class="label-icon" for="search">
                    <i class="material-icons">search</i>
                  </label>
                  <i class="material-icons">close</i>
                </div>
              </form>
            </div>
          </nav>
          <div>
            <input id="searchRepo" placeholder="Search Repository" />
            <button onClick={() => this.searchRepo()}>Search</button>
          </div>

          <div class="row container">
            {this.state.filteredIssues.message ? (
              <div class="row">
                <div class="col s12 m5">
                  <div class="card-panel teal">
                    <span class="white-text">
                      {this.state.filteredIssues.message}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              this.state.filteredIssues.map(issue => {
                return (
                  <div class="col s12 m12 ">
                    <div class="card">
                      <div class="card-content">
                        <span class="card-title">
                          <strong> {issue.title}</strong>
                          {issue.labels.map(label => {
                            return (
                              <a href="#">
                                <span
                                  className="badge"
                                  data-badge-caption={label.name}
                                  style={{
                                    backgroundColor: `#${label.color}`,
                                    color: "black",
                                    fontWeight: "bold"
                                  }}
                                />
                              </a>
                            );
                          })}
                        </span>
                        <p>
                          #{issue.number} opened{" "}
                          {moment(issue.created_at).fromNow()} by{" "}
                          <a class="modal-trigger" href="#modal1">
                            {issue.user.login}
                          </a>
                        </p>
                      </div>
                      <div class="card-action">
                        <a href="#">This is a link</a>
                        <a href="#">This is a link</a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }
  }
}

export default App;
