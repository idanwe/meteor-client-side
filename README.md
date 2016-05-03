# meteor-client-side

Use Meteor's client side DDP protocol and Minimongo in a non Meteor project.


### Installation

#### Bower
`bower install meteor-client-side`

#### NPM
`npm install meteor-client-side`

### Usage

1. Set DDP connection url:

    * Set `__meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL` global variable with the desired url (Defaults to `http://localhost:3000`).

2. Load the meteor-client-side code:
    `<script src="dist/meteor-client-side.bundle.min.js"></script>`


### Examples:

- [ionic-whatsapp](https://github.com/idanwe/ionic-whatsapp)
- [ionic-chat](https://github.com/idanwe/meetup-NY-meteor-ionic-chat)
- [angular-socially](https://github.com/idanwe/angular-socially-client-side)

### Packages:

- [accounts-password](https://github.com/idanwe/accounts-password-client-side)
- [accounts-phone](https://github.com/okland/accounts-phone)
- [accounts-base](https://github.com/idanwe/accounts-base-client-side)


### What I've done

I wanted to be able to use meteor's DDP protocol and Minimongo without the process of change my current project infrastructure and architecture.

In order to make it possible I looked at Meteor's code and try figure out how to set the DDP connection url outside of a Meteor project.
I found that `__meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL` runtime variable need to be set and then it left me with the need to extract meteor code to external use. It was really simple :)

I ran `meteor build --directory` and got the minified version `meteor-client-side.min.js`

In addition, I wanted to use Meteor Accounts packages so I extracted it too [accounts-password-client-side][accounts-password-client-side]

[accounts-password-client-side]: https://github.com/idanwe/accounts-password-client-side
