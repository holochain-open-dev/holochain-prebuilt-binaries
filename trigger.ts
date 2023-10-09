import axios, { AxiosError, AxiosResponse } from "axios";
import {Octokit} from "octokit";
import 'dotenv/config';

const TAG_HC = process.argv[3];
const TAG_LAIR = process.argv[4];

async function main() {
  if(!TAG_HC) {
    console.error("Error: Set a holochain release tag");
    process.exit();
  }
  if(!TAG_LAIR) {
    console.error("Error: Set a lair release tag");
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
        holochain_ref: TAG_HC,
        lair_ref: TAG_LAIR,
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