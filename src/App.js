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
        filteredIssues: [],
        page: 1,
        searchRepo: "facebook/react"
      };
    }

    if (existingToken) {
      this.state = {
        token: existingToken,
        issues: [],
        filteredIssues: [],
        page: 1,
        searchRepo: "facebook/react"
      };
    }
  }

  fetchIssues = async page => {
    try {
      let repo = this.state.searchRepo;
      const response = await fetch(
        `https://api.github.com/repos/${repo}/issues?page=${page}`
      );
      const data = await response.json();
      // console.log("DATA", data);
      this.setState({ issues: data, filteredIssues: data, page });
    } catch (error) {
      this.setState({ error });
    }
  };

  componentDidMount() {
    document.addEventListener("DOMContentLoaded", function() {
      var elems = document.querySelectorAll(".modal");
      var instances = M.Modal.init(elems);
    });
    this.fetchIssues(1);
  }

  searchRepo = () => {
    let repoName = this.state.searchRepo;
    // console.log("REPOOOOOO", repo);
    this.fetchIssues(repoName);
  };

  searchIssues = term => {
    let filteredIssues = this.state.issues.filter(issue =>
      issue.title.toLowerCase().includes(term.toLowerCase())
    );
    this.setState({ filteredIssues });
  };

  renderPagination() {
    let pages = [];
    let current = this.state.page;
    for (let i = 1; i <= 20; i++) {
      pages.push(i);
    }

    return pages.map(page => {
      if (page <= current + 3 && page >= current - 3) {
        return (
          <li
            className={page === current ? "active" : null}
            onClick={() => {
              this.fetchIssues(page);
              console.log("Page", page);
            }}
          >
            <a href="#!">{page}</a>
          </li>
        );
      }
    });
  }

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
            <div class="nav-wrapper cyan">
              {/* <form>
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
              </form> */}
              <a href="#" class="brand-logo">
                Github
              </a>
              <div class="row right col s6">
                <div class="input-field ">
                  <i class="material-icons prefix">search</i>
                  <input
                    id="icon_prefix"
                    type="text"
                    class="validate"
                    onChange={e =>
                      this.setState({ searchRepo: e.target.value })
                    }
                    onSubmit={() => this.searchRepo()}
                  />
                  <label for="icon_prefix">
                    User/repo e.g. 'facebook/react'
                  </label>
                </div>
              </div>
              <ul id="nav" class="right hide-on-med-and-down" />
            </div>
          </nav>
          <div>
            <input
              placeholder="User/repo e.g. 'facebook/react'"
              onChange={e => this.setState({ searchRepo: e.target.value })}
            />
            <button onClick={() => this.searchRepo()}>Search</button>
          </div>
          <div class="card">
            <div class="card-content">
              <p>
                I am a very simple card. I am good at containing small bits of
                information. I am convenient because I require little markup to
                use effectively.
              </p>
            </div>
            <div class="card-tabs ">
              <ul class="tabs tabs-fixed-width ">
                <li class="tab">
                  <a href="#test4">Test 1</a>
                </li>
                <li class="tab">
                  <a class="active" href="#test5">
                    Test 2
                  </a>
                </li>
                <li class="tab">
                  <a href="#test6">Test 3</a>
                </li>
              </ul>
            </div>
            <div class="card-content grey lighten-4">
              <div id="test4">Test 1</div>
              <div id="test5">Test 2</div>
              <div id="test6">Test 3</div>
            </div>
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
                        <div className="title-container">
                          <i
                            class={`material-icons ${
                              issue.state === "open" ? "green-text" : "red-text"
                            }`}
                          >
                            error_outline
                          </i>
                          <p class="card-title">
                            <strong> {issue.title}</strong>
                          </p>
                        </div>
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
                        <small>
                          #{issue.number} opened{" "}
                          {moment(issue.created_at).fromNow()} by{" "}
                          <a class="modal-trigger" href="#modal1">
                            {issue.user.login}
                          </a>
                        </small>
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
          <ul class="pagination container center-align">
            <li class="disabled">
              <a href="#!">
                <i class="material-icons">chevron_left</i>
              </a>
            </li>
            {this.renderPagination()}
            <li class="waves-effect">
              <a href="#!">
                <i class="material-icons">chevron_right</i>
              </a>
            </li>
          </ul>
        </div>
      );
    }
  }
}

export default App;
