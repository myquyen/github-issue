import React, { Component } from 'react'
import M from "materialize-css/dist/js/materialize.min.js";

export default class ModalContent extends Component {

  createIssue = async e => {
    const url = `https://api.github.com/repos/${this.props.searchRepo}/issues`;

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
          Authorization: `Token ${this.props.token}`
        })``
      });
      if (response.ok) {
        M.toast({
          html: "Successfully create issue!",
          classes: "green"
        });
        this.props.fetchIssues();
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

  render() {
    return (
      <div id="new-issue" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h5>Create New Issue</h5>
            <div className="row">
              <form className="col s12">
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      required
                      id="title"
                      type="text"
                      className="validate"
                      ref={e => (this.titleInput = e)}
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
    )
  }
}
