# LinkQuik

A super simple react based Chrome extension to send connection requests to people in LinkedIn quickly.

## Stack
This extension is developed using React and Webpack.

* The entrypoint(manifest.json) is present in static folder.
* The popup folder contains the UI for the extension.
* The contentScript folder acts as a message passing interface and to manipulate DOM.

## How to use?

You can install and run the extension by using the following command:

* npm run build - this will create a 'dist' folder.
* Go to chrome/edge extensions tab chrome://extensions or edge://extensions.
* Enable developer mode
* Click on Load Unpackaged
* Select the 'dist' folder

* This will load the extension to your browser, you can pin it if you want.
* Go to linkedin people search page to see it in action!