import React from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "./App.css";

import Navbar from "./components/Navbar";
import IssueCards from "./components/IssueCards";
import ModalContent from "./components/ModalContent";
import Pagination from "./components/Pagination";

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
    M.AutoInit();
    this.fetchIssues();
  }

  fetchIssues = async (page = 1) => {
    try {
      let repo = this.state.searchRepo;
      let state = "open";

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
    this.fetchIssues();
  };

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
    return (
      <div>
        <Navbar
          searchRepo={this.searchRepo}
          onSearchRepo={(e) => this.setState({ searchRepo: e.target.value })}
        />
        <ModalContent 
          token={this.state.token}
          fetchIssues={this.fetchIssues}
          onCreateIssue={this.createIssue}
          searchRepo={this.state.searchRepo}
        />
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
            >
              Create Issue
            </a>
          </div>
        </div>
        <div className="row container row-container">
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
        <Pagination 
          page={this.state.page}
          fetchIssues={this.fetchIssues}
          total_count={this.state.total_count}
        />
      </div>
    );
  }
}
