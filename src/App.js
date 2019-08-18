import React from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "./App.css";

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
    this.fetchIssues();
  }

  fetchIssues = async (page = 1) => {
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
        total_count: Math.ceil(Math.min(data.total_count, 1000) / 30),
        error: data.errors
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  searchRepo = () => {
    let repoName = this.state.searchRepo;
    // console.log("REPOOOOOO", repo);
    this.fetchIssues();
  };

  createIssue = async e => {
    const url = `https://api.github.com/repos/${this.state.searchRepo}/issues`;

    const title = this.titleInput.value;
    const body = this.bodyInput.value;
    const assignees = this.assigneesInput.value;
    const milestone = this.milestoneInput.value;
    const labels = this.labelsInput.value;
    const input = {
      title,
      body,
      assignees: assignees.split(", "),
      milestone,
      labels: labels.split(", ")
    };
    if (title && body) {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(input),
        headers: new Headers({
          "Content-Type": "application/vnd.github.symmetra-preview+json",
          Authorization: `Token ${this.state.token}`
        })
      });
      if (response.ok) {
        M.toast({
          html: "Successfully create issue!",
          classes: "green"
        });
        this.fetchIssues();
      } else {
        alert(`Unsuccessful response: ${response.statusText}`);
      }
      console.log("RESPONSE", response);
    } else {
      M.toast({
        html: "You need to fill the required fields",
        classes: "amber darken-1"
      });
    }
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

  renderComments = async url => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("PLayed", data);
      this.setState({ comments: data });
    } catch (error) {
      alert("Got error: ", error);
    }
  };

  render() {
    console.log("STATE", this.state);
    if (false) {
      return <div />;
    } else {
      return (
        <div>
          {/* MODAL =============================================================================================     */}
          <div id="new-issue" className="modal modal-fixed-footer">
            <div className="modal-content">
              <h5>Create New Issue</h5>
              <div className="row">
                <form className="col s12">
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="title"
                        type="text"
                        ref={e => (this.titleInput = e)}
                        className="validate"
                        required
                      />
                      <label for="title">Title *</label>
                      <span
                        class="helper-text"
                        data-error="This must not be empty!"
                      >
                        This field is required
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="body"
                        ref={e => (this.bodyInput = e)}
                        type="text"
                        className="validate"
                        required
                      />
                      <label for="body">Description *</label>
                      <span
                        class="helper-text"
                        data-error="This must not be empty!"
                      >
                        This field is required
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="assignee"
                        type="text"
                        className="validate"
                        ref={e => (this.assigneesInput = e)}
                      />
                      <label for="assignee">Assignees</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s6">
                      <input
                        id="milestone"
                        type="number"
                        className="validate"
                        ref={e => (this.milestoneInput = e)}
                      />
                      <label for="milestone">Milestone</label>
                    </div>
                    <div className="input-field col s6">
                      <input
                        id="label"
                        type="text"
                        className="validate"
                        ref={e => (this.labelsInput = e)}
                      />
                      <label for="label">Labels</label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <a
                href="#!"
                onClick={this.createIssue}
                className="modal-close waves-effect btn-flat teal lighten-1 white-text"
              >
                Submit
              </a>
            </div>
          </div>
          {/* COMMENTS MODAL ========================================================================================= */}
          <div id="comments" className="modal bottom-sheet modal-fixed-footer">
            <div className="modal-content">
              <h4>Comments</h4>
              {this.state.comments &&
                this.state.comments.map(comment => {
                  return (
                    <div className="row">
                      <div className="col s12 m12">
                        <div className="card-panel">
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
            <div className="modal-footer">
              <a href="#!" className="modal-close btn-flat">
                Close
              </a>
            </div>
          </div>
          {/* NAVBAR ========================================================================================== */}
          <nav className="cyan darken-4 ">
            <div className=" cyan darken-4 nav-wraper container">
              <a href="#" className="left brand-logo hide-on-small-only">
                GEThub
              </a>
              <div>
                <div className="row right col s6">
                  <div className="input-field ">
                    <i className="material-icons prefix">search</i>
                    <input
                      id="icon_prefix"
                      type="text"
                      className="validate"
                      placeholder="User/repo e.g. 'facebook/react'"
                      onChange={e =>
                        this.setState({ searchRepo: e.target.value })
                      }
                      onSubmit={() => this.searchRepo()}
                    />
                    <a
                      className="btn search-btn"
                      onClick={() => this.searchRepo()}
                    >
                      Search
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          {/* HEADER ========================================================================================== */}

          <div className="card cyan lighten-5">
            <div className="card-content container">
              <h5
                className="blue-grey-text text-darken-3"
                style={{ fontWeight: "bold" }}
              >
                {this.state.searchRepo}
              </h5>
              <a
                className="waves-light btn modal-trigger"
                href="#new-issue"
                // onClick={() =>
                //   this.createIssue("Me testing", "Hello", "", 1, "")
                // }
              >
                Create Issue
              </a>
            </div>
          </div>
          <div className="row container">
            {this.state.error ? (
              <div className="row">
                <div className="col s12 m12">
                  <div className="card-panel teal">
                    <span className="white-text">
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
          <ul className="pagination container center-align">
            <li
              className="waves-effect"
              onClick={() => {
                this.fetchIssues(1);
              }}
            >
              <a href="#!">
                <i className="material-icons">first_page</i>
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
                <i className="material-icons">chevron_left</i>
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
                <i className="material-icons">chevron_right</i>
              </a>
            </li>
            <li
              className="waves-effect"
              onClick={() => {
                this.fetchIssues(this.state.total_count);
              }}
            >
              <a href="#!">
                <i className="material-icons">last_page</i>
              </a>
            </li>
          </ul>
        </div>
      );
    }
  }
}
