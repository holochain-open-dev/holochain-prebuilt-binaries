import axios, { AxiosError, AxiosResponse } from "axios";
import {Octokit} from "octokit";
import 'dotenv/config';

const RELEASE_NAME = process.argv[3];

async function main() {
  if(!RELEASE_NAME) {
    console.error("Error: Set a release name");
    process.exit();
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN
  })

  try {
    let res = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
      owner: 'buildyourwebapp',
      repo: 'holochain-prebuilt-binaries',
      event_type: 'new_holochain_release',
      client_payload: {
        ref: RELEASE_NAME
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    console.log("Triggered build-release workflow");
  } catch(e) {
    //@ts-ignore
    console.error(e);
  }
}

main();