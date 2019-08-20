import React, { Component } from "react";

export default class Navbar extends Component {
  render() {
    return (
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
                  onSubmit={this.props.searchRepo}
                  onChange={e => this.props.onSearchRepo(e)}
                />
                <a className="btn search-btn" onClick={this.props.searchRepo}>
                  Search
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
