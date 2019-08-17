import React from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import moment from "moment";
const ReactMarkdown = require("react-markdown");

export default function(props) {
  const issue = props.issue;
  const componentDidMount = () => {
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems);
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
            <a
              class="modal-trigger"
              href="#modal1"
              onClick={() => this.setState({ user: issue.user.login })}
            >
              {issue.user.login}
            </a>
          </small>
        </div>
        <div class="card-action">
          <a href={issue.comments_url}>
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
