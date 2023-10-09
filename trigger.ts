import axios, { AxiosError, AxiosResponse } from "axios";
import {Octokit} from "octokit";
import 'dotenv/config';

const REPOSITORY_NAME = process.argv[3];
const RELEASE_TAG = process.argv[4];

async function main() {
  if(!REPOSITORY_NAME || !['holochain','lair'].includes(REPOSITORY_NAME)) {
    console.error("Error: Specify a repository 'holochain' or 'lair'");
    process.exit();
  }
  if(!RELEASE_TAG) {
    console.error("Error: Specify a release tag");
    process.exit();
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN
  })

  try {
    await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
      owner: 'buildyourwebapp',
      repo: 'holochain-prebuilt-binaries',
      event_type: `${REPOSITORY_NAME}_release`,
      client_payload: {
        ref: RELEASE_TAG,
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    console.log(`Triggered workflow 'build-release-${REPOSITORY_NAME}' on tag '${RELEASE_TAG}'` );
  } catch(e) {
    //@ts-ignore
    console.error(e);
  }
}

main();