# HG Mirror

This project mirrors the data in from the Genius Hub that is produced by the hg project. Genius heating hub. See https://www.geniushub.co.uk/ for details.

This adds value over the Genius Hub app as it displays the information I want to see. You can customize it to display the information you want to see.

The project makes use of Polymer 2.0 and Firebase. The data is retrieved from Firebase and updates the web page as necessary.

### How To Use

Install the Polymer CLI pre-requisites. The details for how to do this can be found here. https://www.polymer-project.org/2.0/docs/tools/polymer-cli

When the project is cloned run `bower install` to pull in the necessary bower components.

### Configuration
In `src/geniusmirror-app.html` add the necessary information for the firebase-app element.

    <firebase-app 
      api-key="" 
      auth-domain = "" 
      database-url="" 
      project-id="" 
      storage-bucket="" 
      messaging-sender-id="">
    </firebase-app>

The information for this can be obtained from Firebase project that was to publish the data (hg project).

### Testing
With the configuration complete the web app can be tested locally by running  `polymer serve --open`. This should open a browser that displays the running application.

### Publishing
When you are happy with the testing, the app can be published directly to Firebase. Details TBD.

Have a good day everyday.
