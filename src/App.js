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
      let state = "open";
      // const response = await fetch(
      //   `https://api.github.com/repos/${repo}/issues?page=${page}`
      // );

      const response = await fetch(
        `https://api.github.com/search/issues?q=repo:${repo}+type:issues+state:${state}&page=${page}`
      );
      const data = await response.json();
      // console.log("DATA", data);
      this.setState({
        issues: data.items,
        filteredIssues: data.items,
        page,
        total_count: Math.ceil(data.total_count / 30)
      });
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
    let count = this.state.total_count;
    for (let i = 1; i <= count; i++) {
      pages.push(i);
    }

    return pages.map(page => {
      if (page <= current + 3 && page >= current - 3) {
        return (
          <li
            className={page === current ? "active" : null}
            onClick={() => {
              this.fetchIssues(page);
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
          <nav className="cyan darken-4 ">
            <div class=" cyan darken-4 nav-wraper container">
              <a href="#" class="left brand-logo hide-on-small-only">
                GEThub
              </a>
              <div>
                <div class="row right col s6">
                  <div class="input-field ">
                    <i class="material-icons prefix">search</i>
                    <input
                      id="icon_prefix"
                      type="text"
                      class="validate"
                      placeholder="User/repo e.g. 'facebook/react'"
                      onChange={e =>
                        this.setState({ searchRepo: e.target.value })
                      }
                      onSubmit={() => this.searchRepo()}
                    />
                    {/* <label for="icon_prefix">
                    User/repo e.g. 'facebook/react'
                  </label> */}
                    <a class="btn" onClick={() => this.searchRepo()}>
                      Search
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div class="card cyan lighten-5">
            <div className="card-content container">
              <h4 className="blue-grey-text text-darken-2">
                {this.state.searchRepo}
              </h4>
            </div>
            <div className="card-tabs container">
              <ul className="tabs tabs-fixed-width cyan lighten-4 ">
                <li className="tab">
                  <a href="#test4">Test 1</a>
                </li>
                <li className="tab">
                  <a className="active" href="#test5">
                    Test 2
                  </a>
                </li>
                <li className="tab">
                  <a href="#test6">Test 3</a>
                </li>
              </ul>
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
            <li
              class="waves-effect"
              onClick={() => {
                this.fetchIssues(1);
              }}
            >
              <a href="#!">
                <i class="material-icons">first_page</i>
              </a>
            </li>
            <li className="waves-effect">
              <a
                href="#!"
                onClick={() => {
                  if (this.state.page > 1)
                    this.fetchIssues(this.state.page - 1);
                }}
              >
                <i class="material-icons">chevron_left</i>
              </a>
            </li>
            {this.renderPagination()}
            <li className="waves-effect">
              <a
                href="#!"
                onClick={() => {
                  if (this.state.page < this.state.total_count)
                    this.fetchIssues(this.state.page + 1);
                }}
              >
                <i class="material-icons">chevron_right</i>
              </a>
            </li>
            <li
              class="waves-effect"
              onClick={() => {
                this.fetchIssues(this.state.total_count);
              }}
            >
              <a href="#!">
                <i class="material-icons">last_page</i>
              </a>
            </li>
          </ul>
        </div>
      );
    }
  }
}

export default App;
