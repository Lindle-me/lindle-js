# Lindle NODE JS
<a href="https://www.buymeacoffee.com/m2kdevelopments" target="_blank">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

<a href="https://play.google.com/store/apps/details?id=com.m2kdevelopments.lindle" target="_blank">
    <img src="./googleplay.png" alt="Buy Me A Coffee" style="height: 60px !important" >
</a>
<a href="https://chrome.google.com/webstore/detail/igkkojjaikfmiibedalhgmfnjohlhmaj" target="_blank">
    <img src="./chromestore.png" alt="Buy Me A Coffee" style="height: 60px !important" >
</a>


The Nodes JS <a href="https://api.elevenlabs.io/docs">API</a> for Lindle.

## Installation
```
npm i lindle --save
```
or 
```
yarn add lindle
```

## Getting Started
Get your Lindle API key from <a href="https://chrome.google.com/webstore/detail/igkkojjaikfmiibedalhgmfnjohlhmaj">Chrome Extension</a>.

```
const apiKey = process.env.API_KEY;
const { Lindle } = require('lindle');
const lindle = new Lindle(apiKey);
```

## Get Links
```
lindle.getLinks().then((links) => {
    console.log(links);
});
```


## Get Folders
```
lindle.getFolders().then((folders) => {
    console.log(folders);
});
```

## Get Synced Bookmarks
```
lindle.getSyncedBookmarks().then((data) => {
    console.log(data.folders);
    console.log(data.links);
});
```