import React from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "./App.css";

// import "@terebentina/react-popover/lib/styles.css";

import User from "./components/Profile";
import IssueCards from "./components/IssueCards";
// import collapBody from "./components/collapBody";

const ReactMarkdown = require("react-markdown");
const clientId = process.env.REACT_APP_CLIENT_ID;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    const existingToken = sessionStorage.getItem("token");
    const accessToken =
      window.location.search.split("=")[0] === "?access_token"
        ? window.location.search.split("=")[1].slice(0, -6)
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
        searchRepo: "myquyen/tic-tac-toe",

        error: null
      };
    }

    if (existingToken) {
      this.state = {
        token: existingToken,
        issues: [],
        filteredIssues: [],
        page: 1,
        searchRepo: "myquyen/tic-tac-toe",
        error: null
      };
    }
  }

  componentDidMount() {
    // var elems = document.querySelectorAll(".modal");
    // var instances = M.Modal.init(elems);
    // var elems1 = document.querySelectorAll(".collapsible");
    // var instances = M.Collapsible.init(elems1);
    M.AutoInit();
    this.fetchIssues(1);
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
      console.log("DATA", data);
      this.setState({
        issues: data.items,
        filteredIssues: data.items,
        page,
        total_count: Math.ceil(data.total_count / 30),
        error: data.errors
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  searchRepo = () => {
    let repoName = this.state.searchRepo;
    // console.log("REPOOOOOO", repo);
    this.fetchIssues(repoName);
  };

  createIssue = async (title, body, assignees, milestone, labels) => {
    const url = `https://api.github.com/repos/${this.state.searchRepo}/issues`;
    const input = {
      title,
      body,
      assignees: assignees.split(", "),
      milestone,
      labels: labels.split(", ")
    };

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(input),
      headers: new Headers({
        "Content-Type": "application/vnd.github.symmetra-preview+json",
        Authorization: `Token ${this.state.token}`
      })
    });
    console.log("RESPONSE", response);
  };
  // searchIssues = term => {
  //   let filteredIssues = this.state.issues.filter(issue =>
  //     issue.title.toLowerCase().includes(term.toLowerCase())
  //   );
  //   this.setState({ filteredIssues });
  // };

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

  renderComments = async url => {
    const response = await fetch(url);
    const data = await response.json();
    console.log("PLayed");
    this.setState({ comments: data });
  };

  render() {
    console.log("STATE", this.state);
    if (false) {
      return (
        <div>
          <div>tessst</div>
          <div>hello</div>
          <div>hi</div>
        </div>
      );
    } else {
      return (
        <div>
          {/* MODAL =============================================================================================     */}
          <div id="modal1" class="modal modal-fixed-footer">
            <div class="modal-content">
              <h5>Create New Issue</h5>
              <p>
                <div class="row">
                  <form class="col s12">
                    <div class="row">
                      <div class="input-field col s12">
                        <input
                          id="title"
                          type="text"
                          class="validate"
                          required
                        />
                        <label for="title">Title *</label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="input-field col s12">
                        <input
                          id="body"
                          type="text"
                          class="validate"
                          required
                        />
                        <label for="body">Description *</label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="input-field col s12">
                        <input id="assignee" type="text" class="validate" />
                        <label for="assignee">Assignees</label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="input-field col s6">
                        <input id="milestone" type="text" class="validate" />
                        <label for="milestone">Milestone</label>
                      </div>
                      <div class="input-field col s6">
                        <input id="label" type="text" class="validate" />
                        <label for="label">Labels</label>
                      </div>
                    </div>
                  </form>
                </div>
              </p>
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
          <div id="comments" class="modal bottom-sheet modal-fixed-footer">
            <div class="modal-content">
              <h4>Comments</h4>
              {typeof this.state.comments == "number" &&
                this.state.comments.map(comment => {
                  return (
                    <div class="row">
                      <div class="col s12 m12">
                        <div class="card-panel">
                          <strong className="teal-text">
                            {comment.user.login}
                          </strong>
                          <ReactMarkdown source={comment.body} />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div class="modal-footer">
              <a href="#!" class="modal-close btn-flat">
                Close
              </a>
            </div>
          </div>
          {/* NAVBAR ========================================================================================== */}
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
          {/* HEADER ========================================================================================== */}

          <div class="card cyan lighten-5">
            <div className="card-content container">
              <h5
                className="blue-grey-text text-darken-3"
                style={{ fontWeight: "bold" }}
              >
                {this.state.searchRepo}
              </h5>
              <a
                class="waves-effect waves-light btn modal-trigger"
                href="#modal1"
                onClick={() =>
                  this.createIssue("Me testing", "Hello", "", 1, "")
                }
              >
                Modal
              </a>
            </div>
            {/* <div className="card-tabs container">
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
            </div> */}
          </div>
          <div class="row container">
            {this.state.error ? (
              <div class="row">
                <div class="col s12 m12">
                  <div class="card-panel teal">
                    <span class="white-text">
                      {this.state.error[0].message}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              this.state.filteredIssues.map(issue => {
                return (
                  <IssueCards
                    issue={issue}
                    getComments={url => this.renderComments(url)}
                  />
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
