import axios, { AxiosError, AxiosResponse } from "axios";
import {Octokit} from "octokit";
import 'dotenv/config';

const RELEASE_NAME = process.argv[3];
const RELEASE_REF = `tags/${RELEASE_NAME}`;

async function main() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN
  })

  try {
    let res = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
      owner: 'buildyourwebapp',
      repo: 'holochain-prebuild-binaries',
      event_type: 'new_holochain_release',
      client_payload: {
        ref: RELEASE_REF
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
  } catch(e) {
    //@ts-ignore
    console.error(`Error: **${(e as AxiosError).response.statusText}** ${(e as AxiosError).response.data}`);
  }
}

main();