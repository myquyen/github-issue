import React from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import moment from "moment";
import Popover from "@terebentina/react-popover";

import "@terebentina/react-popover/lib/styles.css";

import User from "./Profile";

const ReactMarkdown = require("react-markdown");

const API = "https://api.github.com/users";

export default class IssueCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        username: "theham3d",
        name: "",
        avatar: "",
        location: "",
        repos: "",
        followers: "",
        following: "",
        homeUrl: "",
        notFound: ""
      },
      bool: false
    };
  }
  fetchProfile = username => {
    let url = `${API}/${username}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          bool: true,
          data: {
            username: data.login,
            name: data.name,
            avatar: data.avatar_url,
            location: data.location,
            repos: data.public_repos,
            followers: data.followers,
            following: data.following,
            homeUrl: data.html_url,
            notFound: data.message
          }
        });
      })
      .catch(error => console.log("Oops! . There Is A Problem"));
  };

  componentDidMount = () => {};
  
  render() {
    const issue = this.props.issue;
    return (
      <div class="col s12 m12 ">
        <div class="card">
          <div class="card-content">
            <div className="title-container">
              <div className="title-container-left">
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
              <div className="title-container-right">
                <span style={{ marginRight: ".4rem" }}>by</span>
                <Popover
                  position="top"
                  className="awesome"
                  trigger={
                    <span onClick={() => this.fetchProfile(issue.user.login)}>
                      {issue.user.login}
                    </span>
                  }
                >
                  {this.state.bool && <User data={this.state.data} />}
                </Popover>
              </div>
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
          </div>

          <CollapsibleBody
            class="card-action"
            issue={issue}
            source={issue.body}
            getComments={this.props.getComments}
          />
        </div>
      </div>
    );
  }
}

class CollapsibleBody extends React.Component {
  componentDidMount() {
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems);
  }

  render() {
    const { source, issue } = this.props;
    return (
      <ul class="collapsible">
        <li>
          <div class="collapsible-header">
            <div class="collapsible-header-left">
              <i class="material-icons cyan-text text-darken-4">description</i>
              <span className="flow-text truncate">
                <small>
                  #{issue.number} opened {moment(issue.created_at).fromNow()}
                </small>
              </span>
            </div>
            <a
              class="modal-trigger"
              href="#comments"
              onClick={() => this.props.getComments(issue.comments_url)}
            >
              <i className="material-icons cyan-text">comment</i>
              {issue.comments}
            </a>
          </div>
          <div class="collapsible-body">
            <span className="flow-text">
              <ReactMarkdown source={source} />
            </span>
          </div>
        </li>
      </ul>
    );
  }
}
