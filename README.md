# rpi-love-notes-react
React page that allows for posting love notes.

Also included is a script for Raspberry Pi that makes a butterfly toy flap its wings when a new message is posted!
![butterfly](./docs/butterfly.gif)

## Deployment Instructions
1. Run the AWS Cloudformation template to deploy the back end services.

2. Clone the repo and install dependencies.
`git clone https://github.com/jfining/rpi-love-notes-react.git`
`cd rpi-love-notes-react`
`npm install`

3. Change the API Gateway URL to match what was deployed in your AWS account.
