
<p align="center">    
    <img src="https://avatars.githubusercontent.com/u/58747826?s=200&v=4" height="100">
    <h1 align="center" style="margin-top:0 !important">The <a aria-label="RH logo" href="https://researchhub.com">ResearchHub</a> Next.js web app</h1>
</p>


<p align="center">
  <a aria-label="Join the community" href="https://researchhub-community.slack.com">
    <img alt="" src="https://badgen.net/badge/Join%20the%20community/Slack/yellow?icon=slack">
  </a>
</p>
<p align="center">&nbsp;</p>


## Our mission is to accelerate the pace of scientific research 🚀 

We believe that by empowering scientists to independently fund, create, and publish academic content we can revolutionize the speed at which new knowledge is created and transformed into life-changing products. <a href="https://www.notion.so/researchhub/Working-at-ResearchHub-6e0089f0e234407389eb889d342e5049">We're hiring!</a>

## Setup

1. `nvm use` (installing [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
2. `yarn install`
3. `npm run dev`

## Contributing to the codebase

- Follow this [short guide](https://www.notion.so/researchhub/Philosophy-758dd755003e4f49b55e78468bda35e3?p=91e1c8d75502434f9c0a4eda29f4b421&showMoveTo=true) to ensure our bundle sizes remain optimal
- Write tests
- Our pre-commit hooks will run automatically upon commit (i.e. linting)
- To skip pre-commit hooks, add `--no-verify` flag to force commit (not recommended)

## Tests

#### Integration Tests

Integration tests are created using [cypress](https://www.cypress.io/)

- Run `npm run test` to run all integration tests in headless mode
- Run `npm run cy:open` to pick which tests to run in browser mode
- Run `npm run cy:spec --spec path/to/your/test` to run a specific spec.  
  e.g. `npm run cy:spec --spec tests/cypress/integration/ui/search.spec.js`

## More Info

- This project was bootstrapped with [Create Next App](https://github.com/segmentio/create-next-app).
- Find the most recent version of this guide at [here](https://github.com/segmentio/create-next-app/blob/master/lib/templates/default/README.md). And check out [Next.js repo](https://github.com/zeit/next.js) for the most up-to-date info.
