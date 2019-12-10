#!/bin/bash
if git diff-index --quiet HEAD --; then
    set -o errexit; # Exit on error
echo Step 1/3: Logging into ECR;
    $(aws ecr get-login --no-include-email --region us-west-2 --profile researchhub);
echo Step 2/3: Creating new production image;
    yarn run build:prod;
    docker tag researchhub-web:latest 794128250202.dkr.ecr.us-west-2.amazonaws.com/researchhub-web:latest
    docker push 794128250202.dkr.ecr.us-west-2.amazonaws.com/researchhub-web:latest
echo Step 3/3: Creating elastic beanstalk environment;
    mv Dockerfile Dockerfile.prod.off;
    mv Dockerrun.aws.json.production Dockerrun.aws.json;
    git add Dockerfile.prod.off Dockerfile;
    eb deploy --profile researchhub --staged;
    git reset;
    mv Dockerfile.prod.off Dockerfile;
    mv Dockerrun.aws.json Dockerrun.aws.json.production;
else
    echo Please commit your changes first.;
fi