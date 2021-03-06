import React, { Component } from "react";
import "./Profile.css";
const API = "https://api.github.com/users";

export default function Profile(props) {
  let data = props.data;
  let followers = `${data.homeUrl}/followers`;
  let repositories = `${data.homeUrl}?tab=repositories`;
  let following = `${data.homeUrl}/following`;
  if (data.notFound === "Not Found")
    return (
      <div className="notfound">
        <h2>Oops !!!</h2>
        <p>The Component Couldn't Find The You Were Looking For . Try Again </p>
      </div>
    );
  else
    return (
      <section className="github--profile">
        <div className="github--profile__info">
          <a
            href={data.homeUrl}
            target="_blank"
            title={data.name || data.username}
          >
            <img src={data.avatar} alt={data.username} />
          </a>
          <h2>
            <a href={data.homeUrl} title={data.username} target="_blank">
              {data.name || data.username}
            </a>
          </h2>
          <h3>{data.location || "I Live In My Mind"}</h3>
        </div>
        <div className="github--profile__state">
          <ul style={{ height: "2.5rem", lineHeight: "1.5rem" }}>
            <li>
              <a href={followers} target="_blank" title="Number Of Followers">
                <i style={{ fontSize: "1rem", margin:"0" }}>{data.followers}</i>
                <span style={{ fontSize: ".8rem" }}>Followers</span>
              </a>
            </li>
            <li>
              <a
                href={repositories}
                target="_blank"
                title="Number Of Repositoriy"
              >
                <i style={{ fontSize: "1rem", margin:"0" }}>{data.repos}</i>
                <span style={{ fontSize: ".8rem" }}>Repositories</span>
              </a>
            </li>
            <li>
              <a href={following} target="_blank" title="Number Of Following">
                <i style={{ fontSize: "1rem", margin:"0" }}>{data.following}</i>
                <span style={{ fontSize: ".8rem" }}>Following</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    );
}
