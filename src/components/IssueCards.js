import React from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import moment from "moment";
import Popover from "@terebentina/react-popover";

import "@terebentina/react-popover/lib/styles.css";

import User from "./Profile";

const ReactMarkdown = require("react-markdown");
export default function(props) {
  const issue = props.issue;
  const componentDidMount = () => {
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems);
  };
  const API = "https://api.github.com/users";

  const fetchProfile = username => {
    let url = `${API}/${username}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          username: data.login,
          name: data.name,
          avatar: data.avatar_url,
          location: data.location,
          repos: data.public_repos,
          followers: data.followers,
          following: data.following,
          homeUrl: data.html_url,
          notFound: data.message
        });
      })
      .catch(error => console.log("Oops! . There Is A Problem"));
  };

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
          <CollapsibleBody title={issue.title} source={issue.body} />
          {/* <ReactMarkdown source={issue.body} /> */}
          <small>
            #{issue.number} opened {moment(issue.created_at).fromNow()} by{" "}
            <Popover
              position="top"
              className="awesome"
              trigger={issue.user.login}
            >
              <User onClick={() => this.fetchProfile(issue.user.login)} />
            </Popover>
          </small>
        </div>
        <div class="card-action">
          <a
            class="modal-trigger"
            href="#comments"
            onClick={() => props.getComments(issue.comments_url)}
          >
            <i className="material-icons">comment</i>
            {issue.comments}
          </a>
          <a href="#">This is a link</a>
        </div>
      </div>
    </div>
  );
}

class CollapsibleBody extends React.Component {
  componentDidMount() {
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems);
  }

  render() {
    const { source, title } = this.props;
    return (
      <ul class="collapsible">
        <li>
          <div class="collapsible-header">
            <i class="material-icons">description</i>
            <span className="flow-text truncate">{title}</span>
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
